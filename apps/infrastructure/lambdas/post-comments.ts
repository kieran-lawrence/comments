import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from '../drizzle/schema'
import { APIGatewayProxyEventV2 } from 'aws-lambda'
import { comments } from '../drizzle/schema'

export const handler = async (event: APIGatewayProxyEventV2) => {
    const { DB_NAME, DB_PASSWORD, DB_HOST, DB_USER } = process.env
    if (!DB_NAME || !DB_PASSWORD || !DB_HOST || !DB_USER) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Database connection details are not set',
            }),
        }
    }

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

    try {
        const body = event.body && JSON.parse(event.body)
        const { storyId, userId, content, status } = body

        const result = await db.insert(comments).values({
            storyId,
            userId,
            content,
            status,
        })

        return {
            statusCode: 201,
            body: JSON.stringify(result.rows[0]),
        }
    } catch (err) {
        console.error('Error inserting comment:', err)
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to insert comment' }),
        }
    }
}
