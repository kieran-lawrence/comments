import { Router } from 'express'
import { PrismaClient, Article } from '@prisma/client'
import { articleCommentingStatusSchema } from '../types/types'

const prisma = new PrismaClient()
export const articlesRouter = Router()

// GET /articles
articlesRouter.get('/', async (req, res) => {
    const { searchTerm, status, page } = req.query
    try {
        const searchTermString = searchTerm ? String(searchTerm) : undefined
        const parsedStatus = status
            ? articleCommentingStatusSchema.parse(status)
            : undefined
        const parsedPageNumber = typeof page === 'string' ? parseInt(page) : 0

        const allArticles = await prisma.article.findMany({
            include: {
                comments: {
                    include: {
                        author: true,
                    },
                },
                author: true,
            },
            where: {
                OR: [
                    {
                        articleTitle: {
                            contains: searchTermString,
                            mode: 'insensitive',
                        },
                    },
                    {
                        author: {
                            name: {
                                contains: searchTermString,
                                mode: 'insensitive',
                            },
                        },
                    },
                    { status: parsedStatus },
                ],
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 15, // Limit to 15 articles
            skip: parsedPageNumber * 15, // Correctly calculate offset for pagination
        })
        res.status(200).send(allArticles)
    } catch (error) {
        console.error('Error fetching articles:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

// GET /articles/:id/count
articlesRouter.get('/:id/count', async (req, res) => {
    const articleId = parseInt(req.params.id)
    if (!articleId) {
        res.status(400).json({ error: 'Invalid article ID' })
        return
    }

    try {
        const article = await prisma.article.findUnique({
            where: { id: articleId },
        })
        if (article && article.status === 'CLOSED') {
            res.status(204).json({
                message: 'Commenting is disabled for this article.',
            })
            return
        }
        const commentCount = await prisma.comment.count({
            where: {
                articleId,
                status: 'APPROVED', // Count only approved comments
            },
        })
        res.status(200).json({ count: commentCount })
    } catch (error) {
        console.error('Error counting comments for article:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

// POST /articles
articlesRouter.post('/', async (req, res) => {
    const { articleId, articleUrl, articleTitle, authorId } =
        req.body as Article

    if (!articleId || !articleUrl || !articleTitle || !authorId) {
        res.status(400).json({
            error: 'Missing one or more of the following required fields: articleId, articleUrl, articleTitle, authorId',
        })
        return
    }

    try {
        const newArticle = await prisma.article.create({
            data: {
                articleId,
                articleUrl,
                articleTitle,
                authorId,
            },
        })
        res.status(201).json(newArticle)
    } catch (error) {
        console.error('Error creating article:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})
// PATCH /articles/:id
articlesRouter.patch('/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    const { articleId, articleUrl, articleTitle, status } =
        req.body as Partial<Article>

    if (!id) {
        res.status(400).json({ error: 'Invalid article ID' })
        return
    }

    try {
        const articleCommentingStatus = status
            ? articleCommentingStatusSchema.parse(status)
            : undefined

        const updatedArticle = await prisma.article.update({
            where: { id },
            data: {
                articleId,
                articleUrl,
                articleTitle,
                status: articleCommentingStatus,
            },
        })
        res.status(200).json(updatedArticle)
    } catch (error) {
        console.error('Error updating article:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})
