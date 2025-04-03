import { SECRET_DEFAULT_ACCOUNT_ID } from '$env/static/private'
import { json } from '@sveltejs/kit'

export const GET = async ({ locals }) => {
    try {
        const saasId = SECRET_DEFAULT_ACCOUNT_ID ?? locals.saasId ?? null
        if (!saasId) throw new Error("No se encuentra el saasId para el usuario");
        return json({
            id: saasId,
            currentAccount: {
                id: saasId
            }
        }, {
            headers: new Headers({
                'Set-Cookie': `saas_lotus_id=${saasId}; path=/; Secure; HttpOnly; SameSite=Strict;`
            })
        })
    } catch (error) {
        console.error(error)
        return json(null, {
            headers: new Headers({
                'Set-Cookie': `saas_lotus_id=null; path=/; Secure; HttpOnly; SameSite=Strict; Expires=0`
            })
        })
    }
}