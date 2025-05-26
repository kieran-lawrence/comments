import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'

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
            connection: {
                host: DB_HOST,
                user: DB_USER,
                password: DB_PASSWORD,
                database: DB_NAME,
                port: 5432,
                ssl: { rejectUnauthorized: false },
            },
        })

        await migrate(db, { migrationsFolder: './migrations/drizzle' })

        return {
            statusCode: 201,
            body: JSON.stringify({
                message: 'Migrations applied successfully',
            }),
        }
    } catch (err) {
        console.error('Error performing migration:', err)
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed to perform database migrations',
            }),
        }
    }
}
