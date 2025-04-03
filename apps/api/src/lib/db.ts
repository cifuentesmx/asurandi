import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@asurandi/database';
import env from '../env.js';
const client = postgres(env.DB_URL);
export const pgDb = drizzle(client, {
    schema: schema,
});
