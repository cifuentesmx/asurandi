import { json } from "@sveltejs/kit"
import { unauthenticated } from "../responses.js";
import { getAuthedUser } from "$lib/auth/getAuthedUser.js";
import { decodeToken } from "$lib/auth/decodeToken.js";
import { createSessionCookie } from "$lib/auth/createSessionCookie.js";
import type { AuthedUser } from "@asurandi/types";
export const POST = async ({ request }) => {
    try {
        const [scheme, token] = request.headers.get("Authorization")?.split(" ") || []

        if (scheme !== "Bearer" || !token) {
            throw new Error("No se recibió el token de inicio de sesión.");
        }
        const decodedToken = await decodeToken(token)
            .catch((e) => {
                console.error(e)
                throw new Error("Token de sesión inválido.");
            })

        const user: AuthedUser = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            emailVerified: decodedToken.emailVerified,
            displayName: decodedToken.displayName,
            photoURL: decodedToken.photoURL,
            phoneNumber: decodedToken.phoneNumber,
            disabled: decodedToken.disabled,
            customClaims: decodedToken.customClaims,
        }
        const cookie = await createSessionCookie(token)

        return json(user, {
            headers: new Headers({
                "Set-Cookie": cookie
            }),
            status: 200
        })

    } catch (e) {
        return unauthenticated()
    }
}

export const DELETE = async () => {

    return json({
        message: "Se ha cerrado la sesión correctamente."
    }, {
        headers: new Headers({
            "Set-Cookie": `saas_lotus_session=;path=/; Secure; HttpOnly; SameSite=Strict; Expires=0`,
            'Clear-Site-Data': 'cookies'

        })
    })
}

export const GET = async ({ locals }) => {
    if (!locals.authedUser?.uid) return unauthenticated()
    const authedUser = await getAuthedUser(locals.authedUser?.uid)
    if (!authedUser) {
        return unauthenticated()
    }

    const user: AuthedUser = {
        uid: authedUser.uid,
        email: authedUser.email,
        emailVerified: authedUser.emailVerified,
        displayName: authedUser.displayName,
        photoURL: authedUser.photoURL,
        phoneNumber: authedUser.phoneNumber,
        disabled: authedUser.disabled,
        customClaims: authedUser.customClaims,
    }

    return json(user)
}