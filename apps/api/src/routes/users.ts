import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { Role } from '../types/types'
import { logger } from '../logger'

const prisma = new PrismaClient()
export const usersRouter = Router()

// GET /users
usersRouter.get('/', async (req, res) => {
    try {
        const allUsers = await prisma.user.findMany({
            include: {
                articles: true,
                comments: true,
                commentStatusChanges: true,
                reviewedComments: true,
                ignoredUsers: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })
        res.status(200).send(allUsers)
    } catch (error) {
        console.error('Error fetching users:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

// POST /users
usersRouter.post('/', async (req, res) => {
    const { name, siteId, email } = req.body

    if (!name || !siteId || !email) {
    if (!userId || !name || !email) {
        res.status(400).json({
            error: 'Missing one or more of the following required fields: userId, name, email',
        })
        return
    }

    try {
        const newUser = await prisma.user.create({
            data: {
                id: userId,
                name,
                email,
            },
        })
        logger.info(
            { id: newUser.id, name: newUser.name, role: newUser.role },
            'Successfully created user',
        )

        res.status(201).json(newUser)
    } catch (error) {
        console.error('Error creating user:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

// POST /users/:id/ignore
usersRouter.post('/:id/ignore', async (req, res) => {
    const userId = req.params.id
    const { ignore, ignoredId } = req.body

    if (!userId || typeof ignore !== 'boolean' || !ignoredId) {
        res.status(400).json({
            error: 'Missing one or more of the following required fields: userId, ignore, ignoredId',
        })
        return
    }

    try {
        // If 'ignore' is true, add the ignored user to the user's ignored list
        if (ignore) {
            const updatedUser = await prisma.userIgnoredUsers.create({
                data: {
                    userId,
                    ignoredId,
                },
            })
            res.status(201).json(updatedUser)
            // Else, remove the ignored user from the user's ignored list
        } else {
            await prisma.userIgnoredUsers.deleteMany({
                where: {
                    userId,
                    ignoredId,
                },
            })
            res.status(200).json({ message: 'User unignored successfully' })
        }
    } catch (error) {
        console.error('Error updating user ignore status:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

// PATCH /users/:id
usersRouter.patch('/:id', async (req, res) => {
    const userId = req.params.id
    const { name } = req.body

    if (!userId) {
        res.status(400).json({ error: 'Invalid user ID' })
        return
    }

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name,
            },
        })
        res.status(200).json(updatedUser)
    } catch (error) {
        console.error('Error updating user:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

// PATCH /users/:id/suspend
usersRouter.patch('/:id/suspend', async (req, res) => {
    const userId = req.params.id
    const { suspended, suspendedReason, suspendedUntil, suspendedById } =
        req.body

    if (!userId) {
        res.status(400).json({ error: 'Invalid user ID' })
        return
    }
    if (
        typeof suspended !== 'boolean' ||
        !suspendedById ||
        !suspendedUntil ||
        !suspendedReason
    ) {
        res.status(400).json({
            error: 'Missing one or more of the following required fields: suspended, suspendedById',
        })
        return
    }

    try {
        if (!isAuthorised(suspendedById, userId)) {
            res.status(403).json({
                error: 'You are not authorised to suspend this user',
            })
            return
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                suspended,
                suspendedById: suspended ? suspendedById : null, // Clear if not suspended
                suspendedUntil: suspended ? suspendedUntil : null,
                suspendedReason: suspended ? suspendedReason : null,
            },
        })
        res.status(200).json(updatedUser)
    } catch (error) {
        console.error('Error updating user suspension:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

// PATCH /users/:id/role
usersRouter.patch('/:id/role', async (req, res) => {
    const userId = req.params.id
    const { role, updatedById } = req.body

    if (!userId) {
        res.status(400).json({ error: 'Invalid user ID' })
        return
    }
    if (!role || !updatedById) {
        res.status(400).json({
            error: 'Missing one or more of the following required fields: role, updatedById',
        })
        return
    }

    try {
        if (!isAuthorised(updatedById, userId)) {
            res.status(403).json({
                error: 'You are not authorised to update this users role',
            })
            return
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                role,
            },
        })
        res.status(200).json(updatedUser)
    } catch (error) {
        console.error('Error updating user role:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

// DELETE /users/:id
usersRouter.delete('/:id', async (req, res) => {
    const userId = req.params.id
    const { deletedById } = req.body
    if (!userId) {
        res.status(400).json({ error: 'Invalid user ID' })
        return
    }
    if (!deletedById) {
        res.status(400).json({
            error: 'Missing required field: deletedById',
        })
        return
    }
    try {
        if (!isAuthorised(deletedById, userId)) {
            res.status(403).json({
                error: 'You are not authorised to delete this user',
            })
            return
        }
        // Mark user as deleted
        const deletedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                active: false,
                deleted: true,
            },
        })
        res.status(200).json(deletedUser)
    } catch (error) {
        console.error('Error deleting user:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

const isAuthorised = async (userId: string, targetUserId: string) => {
    // Map roles to access levels
    const roleAccessLevel: Record<Role, number> = {
        USER: 1,
        MODERATOR: 2,
        ADMIN: 3,
    }

    const user = await prisma.user.findFirst({
        where: { id: userId },
    })
    const targetUser = await prisma.user.findFirst({
        where: { id: targetUserId },
    })
    if (!user || !targetUser) {
        console.error('User or target user not found, cannot authorise')
        return false
    }
    // User can always authorise themselves
    if (user.id === targetUser.id) {
        return true
    }
    // Check if the user has the same or higher access level than the target user
    if (roleAccessLevel[user.role] >= roleAccessLevel[targetUser.role]) {
        return true
    }
    return false
}
