import type { Handle } from "@sveltejs/kit"

import { getAuth } from "firebase-admin/auth"
import { initializeAdminApp } from "$lib/firebase/app.server"

const admin = initializeAdminApp()
const auth = getAuth(admin);


export const appendSessionToLocals: Handle = async ({ event, resolve }) => {
    const cookies = event.request.headers.get("cookie")
    const sessionCookie = getCookieValue(cookies, 'saas_lotus_session')
    const saasId = getCookieValue(cookies, 'saas_lotus_id')
    const authedUser = await getIdTokenFromSessionCookie(sessionCookie)
    event.locals = {
        ...event.locals,
        authedUser,
        saasId: saasId ?? undefined,
    }

    return resolve(event)
}


export async function getIdTokenFromSessionCookie(sessionCookie: string | null) {
    if (!sessionCookie) {
        return null
    }
    const decodedIdToken = await auth.verifySessionCookie(sessionCookie, true /** checkRevoked */)
        .catch(() => {
            return null
        })
    return decodedIdToken
}

export function getCookieValue(
    cookie: string | null,
    name: string
): string | null {
    return cookie?.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || null
}