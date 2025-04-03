import { hasRole } from '$lib/auth/hasRole.js'
import { redirect } from '@sveltejs/kit'
import { listAccountUsers } from '$api/users/listAccountUsers.js';


export const load = async ({ locals }) => {
    if (!locals.saasId || !locals.authedUser?.uid) {
        throw redirect(302, '/')
    }

    if (!await hasRole('admin', locals)) throw redirect(302, '/app')

    const users = await listAccountUsers(locals.saasId)
    return { users }
}