import { defineConfig } from 'drizzle-kit'

export default defineConfig({
    dialect: 'postgresql',
    schema: './drizzle/schema.ts',

    migrations: {
        prefix: 'timestamp',
        table: 'drizzle_migrations',
        schema: 'public',
    },
})
