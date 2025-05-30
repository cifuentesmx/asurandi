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
    FIREBASE_ADMIN_CLIENT_EMAIL: z.string(),
    FIREBASE_ADMIN_PRIVATE_KEY: z.string(),
    FIREBASE_CONNECT_EMULATORS: z.coerce.boolean(),
    FIREBASE_EMULATORS_HOST: z.string(),
})

export type env = z.infer<typeof EnvSchema>


// eslint-disable-next-line import/no-mutable-exports, ts/no-redeclare
let env: env
try {
    // eslint-disable-next-line node/prefer-global/process
    env = EnvSchema.parse(process.env)
}
catch (e) {
    const error = e as ZodError
    error.flatten()
    console.error('❌ invalid env:')
    console.error(error.flatten().fieldErrors)
    // eslint-disable-next-line node/prefer-global/process
    process.exit(1)
}
export const dev = env.NODE_ENV !== 'production'
export default env
