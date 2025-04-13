// @ts-nocheck
import type { Config } from 'drizzle-kit';

import { defineConfig } from 'drizzle-kit';
export default defineConfig({
    schema: './dist/index.js',
    out: './drizzle',
    dialect: 'postgresql', // 'postgresql' | 'mysql' | 'sqlite'
    dbCredentials: {
        url: process.env.POSTGRES_DB_CONNECTION_STRING!
    }
}) satisfies Config;
