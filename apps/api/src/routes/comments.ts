import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import {
    commentStatusChangeBySchema,
    commentStatusSchema,
} from '../types/types'
const prisma = new PrismaClient()
export const commentsRouter = Router()

// GET /comments
commentsRouter.get('/', async (req, res) => {
    const { siteId, page } = req.query

    try {
        const parsedPageNumber = typeof page === 'string' ? parseInt(page) : 0

        const comments = await prisma.comment.findMany({
            where: {
                article: {
                    siteId: siteId ? JSON.stringify(siteId) : undefined,
                },
            },
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
            take: 15, // Limit to 15 comments
            skip: parsedPageNumber, // Page number for pagination
        })
        res.status(200).json(comments)
    } catch (error) {
        console.error('Error fetching comments:', error)
        res.status(500).json({ error: 'Internal server error' })
        return
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
