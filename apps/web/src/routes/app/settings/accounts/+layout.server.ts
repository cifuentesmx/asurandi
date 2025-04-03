import { listQualitasAccounts } from "$api/accounts/listQualitasAccounts"
import { hasRole } from "$lib/auth/hasRole.js"
import { redirect } from "@sveltejs/kit"

export const load = async ({ locals }) => {
    if (!locals.saasId || !locals.authedUser?.uid) {
        throw redirect(302, '/')
    }

    if (!await hasRole('admin', locals)) throw redirect(302, '/app')

    const qualitasAccounts = await listQualitasAccounts(locals.saasId)
    return { qualitasAccounts }
}