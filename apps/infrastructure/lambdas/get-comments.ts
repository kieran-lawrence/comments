import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from '../drizzle/schema'

export const handler = async () => {
    const { DB_NAME, DB_PASSWORD, DB_HOST, DB_USER } = process.env
    if (!DB_NAME || !DB_PASSWORD || !DB_HOST || !DB_USER) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Database connection details are not set',
            }),
        }
    }

    try {
        const db = drizzle({
            schema: { ...schema },
            connection: {
                host: DB_HOST,
                user: DB_USER,
                password: DB_PASSWORD,
                database: DB_NAME,
                port: 5432,
                ssl: { rejectUnauthorized: false },
            },
        })

        const result = await db.query.comments.findMany({
            orderBy: (comments, { desc }) => [desc(comments.createdAt)],
            limit: 10,
        })

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(result),
        }
    } catch (e) {
        console.error(e)
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        }
    }
}
