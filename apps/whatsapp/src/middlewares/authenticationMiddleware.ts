import { initializeAdminApp } from '../lib/firebase.server.js'
import type { ApiAuthUser } from '@asurandi/types'
import { getAuth } from 'firebase-admin/auth'
import type { Context, MiddlewareHandler } from 'hono'

export const sessionCookieMiddleware = (): MiddlewareHandler => {
    return async (c: Context, next) => {
        const authorizationStr = c.req.header('authorization')
        if (!authorizationStr) return await next()

        const idToken = authorizationStr.replace('Bearer ', '')

        if (!idToken) return await next()

        const app = initializeAdminApp()
        const auth = getAuth(app)
        const decodedToken = await auth.verifyIdToken(idToken).catch(() => null)
        if (!decodedToken) return await next()
        const user: ApiAuthUser = {
            uid: decodedToken.uid,
            email: decodedToken.email ?? '',
        }

        c.set('user', user)
        return await next()
    }
}
