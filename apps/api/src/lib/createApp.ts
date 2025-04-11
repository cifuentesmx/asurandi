import type { AppBindings, AppOpenAPI } from '@asurandi/types'
import { logger } from '../middlewares/pinoLogger.js'
import { OpenAPIHono } from '@hono/zod-openapi'
import { notFound, onError, serveEmojiFavicon } from 'stoker/middlewares'
import { defaultHook } from 'stoker/openapi'
import { cors } from 'hono/cors'
import { sessionCookieMiddleware } from '../middlewares/authenticationMiddleware.js'

export function createRouter(): AppOpenAPI {
    return new OpenAPIHono<AppBindings>({
        strict: false,
        defaultHook,
    })
}

export default function createApp(): AppOpenAPI {
    const app = createRouter()
    app.use(logger())
    app.use(serveEmojiFavicon('🚘'))
    app.notFound(notFound)
    app.onError(onError)
    app.use('/*', cors())
    app.use('/*', sessionCookieMiddleware())
    return app
}
