import type { OpenAPIHono, RouteConfig, RouteHandler } from '@hono/zod-openapi'
import type { PinoLogger } from 'hono-pino'

export interface AppBindings {
    Variables: {
        logger: PinoLogger
        user?: ApiAuthUser
    }
}

export type ApiAuthUser = {
    email: string,
    uid: string,
    saasId: string
}

export type AppOpenAPI = OpenAPIHono<AppBindings>

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, AppBindings>