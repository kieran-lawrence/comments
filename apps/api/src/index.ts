import express from 'express'
import { commentsRouter } from './routes/comments'
import { sitesRouter } from './routes/sites'
import { usersRouter } from './routes/users'
import { articlesRouter } from './routes/articles'
import cors from 'cors'
import { statusChangesRouter } from './routes/status-changes'
import { statisticsRouter } from './routes/statistics'

// Initialise Express
const app = express()
const PORT = 80 // This must match the port defined in the ECS Task Definition in `apps/infrastructure/comments.ts`

// Middleware to parse JSON bodies
app.use(express.json())
// Middleware to enable CORS
app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
    }),
)

// Middleware to handle API key
app.use((req, res, next) => {
    const key = req.get('x-api-key')

    if (!key) {
        res.status(401).json({ error: 'X-API-KEY header missing' })
        return
    }

    const apiKey = process.env.API_KEY

    if (!apiKey) {
        res.status(401).json({ error: 'X-API-KEY missing from environment' })
        return
    }

    if (key !== apiKey) {
        res.status(401).json({ error: 'Invalid X-API-KEY' })
        return
    }

    next()
})

// Register routes
app.use('/comments', commentsRouter)
app.use('/sites', sitesRouter)
app.use('/users', usersRouter)
app.use('/articles', articlesRouter)
app.use('/status-changes', statusChangesRouter)
app.use('/statistics', statisticsRouter)

// Start the server
app.listen(PORT, () => {
    console.log(`Comments API listening on port ${PORT}`)
})
