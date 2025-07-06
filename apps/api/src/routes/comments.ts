import { Router } from 'express'
import { Comment, PrismaClient } from '@prisma/client'
import {
    commentStatusChangeBySchema,
    commentStatusSchema,
} from '../types/types'
const prisma = new PrismaClient()
export const commentsRouter = Router()

// GET /comments
commentsRouter.get('/', async (req, res) => {
    const { page, page_size, status } = req.query
    // Support multiple statuses: ?status=APPROVED&status=FLAGGED
    let statusArray: string[] = []
    if (Array.isArray(status)) {
        statusArray = status
            .filter((s): s is string => typeof s === 'string')
            .filter((s) => commentStatusSchema.safeParse(s).success)
    } else if (typeof status === 'string') {
        if (commentStatusSchema.safeParse(status).success) {
            statusArray = [status]
        }
    }

    try {
        const parsedPageNumber = typeof page === 'string' ? parseInt(page) : 0
        const parsedPageSize =
            typeof page_size === 'string' ? parseInt(page_size) : 15 // Limit to 15 comments by default

        const comments = await prisma.comment.findMany({
            include: {
                article: true,
                author: true,
                reviewedBy: true,
                flaggedBy: true,
                parent: {
                    include: {
                        author: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            where: {
                status:
                    statusArray.length > 0
                        ? { in: statusArray as Comment['status'][] }
                        : undefined, // Filter by status array if provided
            },
            take: parsedPageSize,
            skip: parsedPageNumber * parsedPageSize, // Correctly calculate offset for pagination
        })
        res.status(200).json(comments)
    } catch (error) {
        console.error('Error fetching comments:', error)
        res.status(500).json({ error: 'Internal server error' })
        return
    }
})
// GET /comments/:articleId
commentsRouter.get('/:articleId', async (req, res) => {
    const id = parseInt(req.params.articleId)
    if (!id) {
        res.status(400).json({ error: 'Invalid article ID' })
        return
    }
    try {
        const comments = await prisma.comment.findMany({
            where: {
                article: { id },
                status: 'APPROVED', // Only fetch approved comments
            },
            include: {
                author: true,
                parent: {
                    include: {
                        author: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        })
        res.status(200).json(comments)
    } catch (error) {
        console.error('Error fetching comments for article:', error)
        res.status(500).json({ error: 'Internal server error' })
        return
    }
})

type CommentThread = Comment & { replies: CommentThread[] }
// GET /:commentId/thread
commentsRouter.get('/:commentId/thread', async (req, res) => {
    const commentId = parseInt(req.params.commentId)
    try {
        // Find the topmost parent comment id
        const topmostParentId = await findTopmostParentId(commentId)

        // Fetch all comments belonging to the same article as the topmost parent
        const rootComment = await prisma.comment.findUnique({
            where: { id: topmostParentId },
            include: {
                article: true,
            },
        })

        if (!rootComment) {
            res.status(404).json({ error: 'Comment not found' })
            return
        }

        // Fetch all comments for the same article (thread)
        const comments = await prisma.comment.findMany({
            where: { articleId: rootComment.articleId },
            include: {
                author: true,
                reviewedBy: true,
                flaggedBy: true,
                parent: {
                    include: {
                        author: true,
                    },
                },
            },
            orderBy: { createdAt: 'asc' },
        })

        // Build comment map with replies
        const commentMap = new Map<number, CommentThread>()
        comments.forEach((comment) => {
            commentMap.set(comment.id, { ...comment, replies: [] })
        })

        // Build tree structure by linking replies to their parents
        commentMap.forEach((comment) => {
            if (comment.parentId) {
                const parent = commentMap.get(comment.parentId)
                if (parent) {
                    parent.replies.push(comment)
                }
            }
        })

        res.json(commentMap.get(topmostParentId))
    } catch (error) {
        console.error(
            `Error fetching comment thread for comment: ${commentId}`,
            error,
        )
        res.status(500).json({ error: 'Internal server error' })
    }
})

// POST /comments
commentsRouter.post('/', async (req, res) => {
    //TODO: Add content validation / moderation
    const { content, authorId, articleId } = req.body

    if (!content || !authorId || !articleId) {
        res.status(400).json({
            error: 'Missing one or more of the following required fields: content, authorId, articleId',
        })
        return
    }

    try {
        const newComment = await prisma.comment.create({
            data: {
                content,
                authorId,
                articleId,
            },
        })
        res.status(201).json(newComment)
    } catch (error) {
        console.error('Error creating comment:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

// POST /comments/:id/reply
commentsRouter.post('/:id/reply', async (req, res) => {
    const { content, authorId, articleId } = req.body
    const parentId = parseInt(req.params.id)

    if (!parentId) {
        res.status(400).json({ error: 'Invalid comment parent ID' })
        return
    }
    if (!content || !authorId || !articleId) {
        res.status(400).json({
            error: 'Missing one or more of the following required fields: content, authorId, articleId',
        })
        return
    }

    try {
        const newReply = await prisma.comment.create({
            data: {
                articleId,
                content,
                authorId,
                parentId,
            },
        })
        res.status(201).json(newReply)
    } catch (error) {
        console.error('Error creating comment reply:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

// PATCH /comments/:id
commentsRouter.patch('/:id', async (req, res) => {
    const { content, userId } = req.body
    const commentId = parseInt(req.params.id)

    if (!commentId) {
        res.status(400).json({ error: 'Invalid comment ID' })
        return
    }
    if (!content) {
        res.status(400).json({
            error: 'Missing required field: content',
        })
        return
    }

    try {
        const comment = await prisma.comment.findFirst({
            where: { id: commentId },
        })
        if (!comment) {
            res.status(404).json({ error: 'Comment not found' })
            return
        }
        if (comment.authorId !== userId) {
            res.status(403).json({
                error: 'You are not authorised to edit this comment',
            })
            return
        }

        const updatedComment = await prisma.comment.update({
            where: { id: comment.id },
            data: {
                content,
            },
        })
        res.status(200).json(updatedComment)
    } catch (error) {
        console.error('Error updating comment:', error)
        res.status(500).json({ error: 'Internal server error' })
        return
    }
})

// PATCH /comments/:id/status
commentsRouter.patch('/:id/status', async (req, res) => {
    const { status, changedById, changedReason, changedBy } = req.body
    const commentId = parseInt(req.params.id)

    if (!commentId) {
        res.status(400).json({ error: 'Invalid comment ID' })
        return
    }
    if (!status) {
        res.status(400).json({
            error: 'Missing required field: status',
        })
        return
    }

    try {
        const newStatus = commentStatusSchema.parse(status)
        const changedByParsed = commentStatusChangeBySchema.parse(
            changedBy ?? 'SYSTEM',
        )

        // Ensure the comment exists
        const comment = await prisma.comment.findFirst({
            where: { id: commentId },
        })
        if (!comment) {
            throw new Error('Comment not found')
        }
        // Update the CommentStatusChanges table
        await prisma.commentStatusChanges.create({
            data: {
                commentId: comment.id,
                oldStatus: comment.status,
                newStatus,
                changedById: changedById, // Optional user ID for the change
                changedReason, // Optional reason for the change
                changedBy: changedByParsed, // Defaults to 'SYSTEM' if not provided
            },
        })
        // Update the comment status
        const updatedComment = await prisma.comment.update({
            where: { id: comment.id },
            data: {
                status: newStatus,
                reviewedById: newStatus === 'FLAGGED' ? null : changedById, // Optional user ID for the change
                flaggedById: newStatus === 'FLAGGED' ? changedById : null, // Set flaggedById if status is FLAGGED, else set it back to null
            },
        })
        res.status(201).json(updatedComment)
    } catch (error) {
        console.error('Error updating comment status:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

// POST /comments/:id/like
commentsRouter.post('/:id/like', async (req, res) => {
    const commentId = parseInt(req.params.id)

    if (!commentId) {
        res.status(400).json({ error: 'Invalid comment ID' })
        return
    }

    try {
        // Get current like count
        const comment = await prisma.comment.findFirst({
            where: { id: commentId },
            select: { id: true, likeCount: true },
        })
        if (!comment) {
            res.status(404).json({ error: 'Comment not found' })
            return
        }
        // Increment the like count
        const newCount = comment.likeCount + 1
        // Update the comment with the new like count
        const newLike = await prisma.comment.update({
            where: { id: comment.id },
            data: {
                likeCount: newCount,
            },
        })
        res.status(200).json(newLike)
    } catch (error) {
        console.error('Error liking comment:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

/** Finds the topmost parent comment id given any commentId */
const findTopmostParentId = async (commentId: number): Promise<number> => {
    let currentId = commentId
    const MAX_SEARCH_DEPTH = 5 // Maximum depth to search for topmost parent
    let depth = 0
    // Loop until we find a comment with no parentId
    while (depth < MAX_SEARCH_DEPTH) {
        const comment = await prisma.comment.findUnique({
            where: { id: currentId },
            select: { parentId: true },
        })
        if (!comment) {
            throw new Error(
                `Unable to find parent comment for id: ${currentId}`,
            )
        }

        if (!comment.parentId) return currentId
        currentId = comment.parentId
        depth++
    }
    return currentId // Return the last found parentId if max depth reached
}
