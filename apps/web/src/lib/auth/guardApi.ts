import { type Handle, error } from "@sveltejs/kit"

const guest = [
    'POST:/api/agent-platform/v1/auth/email',
    'POST:/api/session',
    'GET:/api/session',
    'DELETE:/api/session',
]
export const guardApi: Handle = async ({ event, resolve }) => {
    const { pathname } = event.url
    const user = event.locals.authedUser
    if (user)
        return resolve(event)

    if (guest.includes(`${event.request.method}:${pathname}`)) {
        return resolve(event)
    }
    throw error(401, 'Unauthorized')
}