import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
export const sitesRouter = Router()

// GET /sites
sitesRouter.get('/', async (req, res) => {
    try {
        const allSites = await prisma.site.findMany({
            select: {
                id: true,
                name: true,
                createdAt: true,
                users: true,
                articles: {
                    select: {
                        id: true,
                        articleId: true,
                        articleTitle: true,
                        articleUrl: true,
                        comments: true,
                    },
                },
            },
        })
        res.status(200).send(allSites)
    } catch (error) {
        console.error('Error fetching sites:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

// POST /sites
sitesRouter.post('/', async (req, res) => {
    const { name } = req.body

    if (!name) {
        res.status(400).json({ error: 'Missing required field: name' })
    }

    try {
        const newSite = await prisma.site.create({
            data: {
                name,
            },
        })
        res.status(201).json(newSite)
    } catch (error) {
        console.error('Error creating site:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})
