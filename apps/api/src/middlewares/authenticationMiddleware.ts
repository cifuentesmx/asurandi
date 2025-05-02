import { initializeAdminApp } from '../lib/firebase.server.js'
import { getAuth } from 'firebase-admin/auth'
import { NextFunction, Request, Response } from 'express'
import { ApiAuthUser } from '@asurandi/types'

export const sessionCookieMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authorizationStr = req.header('authorization')
    if (!authorizationStr) return next()

    const idToken = authorizationStr.replace('Bearer ', '')

    if (!idToken) return next()

    const app = initializeAdminApp()
    const auth = getAuth(app)
    const decodedToken = await auth.verifyIdToken(idToken).catch(() => null)
    if (!decodedToken) return next()
    const user: ApiAuthUser = {
        uid: decodedToken.uid,
        email: decodedToken.email ?? '',
    }

    req.user = user
    return next()
}

