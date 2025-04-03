import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@asurandi/database'
config()

const client = postgres(process.env.DB_URL!);
export const pgDb = drizzle(client, {
    schema: schema,
});


