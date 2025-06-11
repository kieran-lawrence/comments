import express from 'express'
import { commentsRouter } from './routes/comments'
import { sitesRouter } from './routes/sites'
import { usersRouter } from './routes/users'
import { articlesRouter } from './routes/articles'

// Initialise Express
const app = express()
const PORT = 80 // This must match the port defined in the ECS Task Definition in `apps/infrastructure/comments.ts`

// Middleware to parse JSON bodies
app.use(express.json())

// Middleware to handle API
app.use((req, res, next) => {
    const key = req.get('x-api-key')

    if (!key) {
        res.status(401).json({ error: 'X-API-KEY header missing' })
        next()
    }

    const apiKey = process.env.API_KEY

    if (!key) {
        res.status(401).json({ error: 'X-API-KEY missing from environment' })
        next()
    }

    if (key !== apiKey) {
        res.status(401).json({ error: 'Invalid X-API-KEY' })
        next()
    }

    next()
})

// Register routes
app.use('/comments', commentsRouter)
app.use('/sites', sitesRouter)
app.use('/users', usersRouter)
app.use('/articles', articlesRouter)

// Start the server
app.listen(PORT, () => {
    console.log(`Comments API listening on port ${PORT}`)
})
