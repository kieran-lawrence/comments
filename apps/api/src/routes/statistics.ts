import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
export const statisticsRouter = Router()

// GET /statistics
statisticsRouter.get('/', async (req, res) => {
    try {
        // Get a record of all users
        const allUsers = await prisma.user.findMany()
        // Filter down to only active users
        const activeUsers = allUsers.filter((user) => user.active).length

        // Keep track of today's date, is used in all the calculations below
        const TODAY = new Date()

        // Calculate new users for each of the last 7 days
        const newUsersLast7Days = Array.from({ length: 7 })
            .map((_, i) => {
                // Create a copy of todays date so as not to mutate it
                const day = new Date(TODAY)
                day.setHours(0, 0, 0, 0)
                day.setDate(TODAY.getDate() - i)

                // Another copy of the current day, then add one day to it (to get the next day)
                const nextDay = new Date(day)
                nextDay.setDate(day.getDate() + 1)

                // Count users created between these 2 dates
                const userCount = allUsers.filter((user) => {
                    const userCreatedAt = new Date(user.createdAt)
                    return userCreatedAt >= day && userCreatedAt < nextDay
                }).length

                // Return the date and user count for this day
                return {
                    date: day.toISOString(),
                    userCount,
                }
            })
            .reverse() // Reverse the array to have the most recent day first

        // Get a record of all comments
        const allComments = await prisma.comment.findMany()

        // Filter down to only comments created today
        const newCommentsToday = allComments.filter((comment) => {
            const commentCreatedAt = new Date(comment.createdAt)
            return (
                commentCreatedAt.getDate() === TODAY.getDate() &&
                commentCreatedAt.getMonth() === TODAY.getMonth() &&
                commentCreatedAt.getFullYear() === TODAY.getFullYear()
            )
        })

        // Get all articles that have comments created today
        const todaysComments = await prisma.article.findMany({
            select: {
                id: true,
                articleTitle: true,
                articleUrl: true,
                comments: {
                    where: {
                        createdAt: {
                            gte: new Date(
                                TODAY.getFullYear(),
                                TODAY.getMonth(),
                                TODAY.getDate(),
                            ),
                        },
                    },
                },
            },
        })
        // Sort the articles by the number of comments created today and take the top 5
        const topComments = todaysComments
            .sort((a, b) => {
                return b.comments.length - a.comments.length
            })
            .slice(0, 5)

        // Map the top comments to a more readable format
        const topCommentsToday = topComments
            .map((article) => {
                return {
                    articleId: article.id,
                    articleTitle: article.articleTitle,
                    articleUrl: article.articleUrl,
                    commentCount: article.comments.length,
                }
            })
            .sort((a, b) => b.commentCount - a.commentCount)

        // Calculate comments for each of the last 24 hours
        const commentsLast24Hours = Array.from({ length: 24 }).map((_, i) => {
            // Create a copy of todays date so as not to mutate it
            const firstHour = new Date(TODAY)
            // Set the time to the start of the hour
            firstHour.setMinutes(0, 0, 0)
            // Set the hour to the current hour minus the index (to get the last 24 hours)
            firstHour.setHours(TODAY.getHours() - (23 - i))

            // Create a copy of the first hour and add one hour to it
            const lastHour = new Date(firstHour)
            lastHour.setHours(firstHour.getHours() + 1)

            // Get the count of comments created between these 2 hours
            const commentCount = allComments.filter((comment) => {
                const commentCreatedAt = new Date(comment.createdAt)
                return (
                    commentCreatedAt >= firstHour && commentCreatedAt < lastHour
                )
            }).length

            // Return the first hour and comment count for this hour
            return {
                hour: firstHour.toISOString(),
                commentCount,
            }
        })

        res.status(200).json({
            // Engagement Summary
            newCommentsToday: newCommentsToday.length,
            pendingComments: allComments.filter(
                (comment) => comment.status === 'PENDING',
            ).length,
            totalComments: allComments.map((comment) => {
                return {
                    id: comment.id,
                    status: comment.status,
                }
            }),
            activeUsers,
            approvalRate: allComments.filter(
                (comment) => comment.status === 'APPROVED',
            ).length,
            flaggedCommentRate: allComments.filter(
                (comment) => comment.status === 'FLAGGED',
            ).length,
            // New users graph
            newUsersLast7Days,
            // Comments by hour
            commentsLast24Hours,
            // Trending conversations
            topCommentsToday,
        })
    } catch (error) {
        console.error('Error fetching statistics:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})
