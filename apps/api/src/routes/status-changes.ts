import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
export const statusChangesRouter = Router()

// GET /status-changes
statusChangesRouter.get('/', async (req, res) => {
    try {
        const allStatusChanges = await prisma.commentStatusChanges.findMany({
            include: {
                comment: true,
                changedByUser: true,
            },
            orderBy: {
                changedAt: 'desc',
            },
        })
        res.status(200).send(allStatusChanges)
    } catch (error) {
        console.error('Error fetching status changes:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})
