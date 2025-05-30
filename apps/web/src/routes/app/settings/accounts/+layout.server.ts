import { listQualitasAccounts } from "$api/accounts/listQualitasAccounts"
import { listAnasegurosAccounts } from "$api/accounts/listAnasegurosAccounts"
import { hasRole } from "$lib/auth/hasRole.js"
import { redirect } from "@sveltejs/kit"

export const load = async ({ locals }) => {
    if (!locals.saasId || !locals.authedUser?.uid) {
        throw redirect(302, '/')
    }

    if (!await hasRole('admin', locals)) throw redirect(302, '/app')

    const tasks = Promise.allSettled([
        listQualitasAccounts(locals.saasId),
        listAnasegurosAccounts(locals.saasId)
    ]).then(([qualitasAccounts, anasegurosAccounts]) => {
        if (qualitasAccounts.status === 'fulfilled' && anasegurosAccounts.status === 'fulfilled') {
            return {
                qualitasAccounts: qualitasAccounts.value,
                anasegurosAccounts: anasegurosAccounts.value,
                status: 'success'
            }
        }
        throw new Error('Failed to fetch accounts')
    })


    return await tasks
}