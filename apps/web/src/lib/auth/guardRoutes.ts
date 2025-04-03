import { redirect, type Handle } from "@sveltejs/kit"
import { guardApi } from "./guardApi"

const authed = ['/app']
const withActiveAccounts: string[] = []
const guest = ['/login']
const overrideAuth = ['/app/bot']

export const guardRoutes: Handle = async ({ event, resolve }) => {
    const { pathname,
        // searchParams,
        search } = event.url
    if (pathname === '/') return resolve(event)
    for (let i = 0; i < overrideAuth.length; i++) {
        const r = overrideAuth[i];
        if (pathname.startsWith(r)) return resolve(event)
    }

    if (pathname.startsWith('/api')) return guardApi({ event, resolve })

    const user = event.locals.authedUser

    // let redirectTo = searchParams.get('redirect') ?? '/app?fromRedirect=1'
    // searchParams.forEach((param, id) => {
    //     if (id !== 'redirect') {
    //         redirectTo += `&${id}=${param}`
    //     }
    // });


    if (pathname.startsWith('/app') && !user) {
        throw redirect(302, `/login/verify?redirect=${pathname}${search}`);
    }

    if (withActiveAccounts.includes(pathname) && !user?.customClaims?.accounts?.length) {
        throw redirect(302, `/login/verify?redirect=${pathname}${search}`);
    }

    if (authed.includes(pathname) && !user) {
        throw redirect(302, `/login/verify?redirect=${pathname}${search}`);
    }

    if (guest.includes(pathname) && user) {
        throw redirect(302, '/app?guardGest=1')
    }

    return resolve(event)
}