import express from 'express'

// Initialise Express
const app = express()

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

const port = 80

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
