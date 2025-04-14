import type { ZodError } from 'zod'
import { config } from 'dotenv'
import { expand } from 'dotenv-expand'
import { z } from 'zod'

expand(config())

const EnvSchema = z.object({
    NODE_ENV: z.string().default('developement'),
    PORT: z.coerce.number().default(8000),
    LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']),
    DB_URL: z.string().url(),
    FIREBASE_PROJECT_ID: z.string(),
    FIREBASE_STORAGE_BUCKET: z.string(),
    FIREBASE_ADMIN_CLIENT_EMAIL: z.string(),
    FIREBASE_ADMIN_PRIVATE_KEY: z.string(),
    FIREBASE_CONNECT_EMULATORS: z.coerce.boolean(),
    FIREBASE_EMULATORS_HOST: z.string(),
    RABBIT_CONNECTION_STRING: z.string().url(),
    DAILY_SCRAPPER_CRONTAB_STRING: z.string().default('0 */4 * * *'), // every 4 hours
    WEEKLY_REPORT_CRONTAB_STRING: z.string().default('0 8 * * 1'), // every monday at 8:00 am
    MONTHLY_REPORT_CRONTAB_STRING: z.string().default('30 7 1 * *'), // every first day of the month at 7:30 am
    CLEANUP_FILES_CRONTAB_STRING: z.string().default('0 */6 * * *'), // every 6 hours
})

export type env = z.infer<typeof EnvSchema>
let theEnv: env
try {
    theEnv = EnvSchema.parse(process.env)
} catch (e) {
    const error = e as ZodError
    error.flatten()
    console.error('❌ invalid env:')
    console.error(error.flatten().fieldErrors)
    process.exit(1)
}
export const env = theEnv
export const dev = env.NODE_ENV !== 'production'

