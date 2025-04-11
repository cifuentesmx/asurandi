import { listPolizas } from "$api/polizas/listPolizas"
import { hasRole } from "$lib/auth/hasRole"
import { json, redirect } from "@sveltejs/kit"

export const GET = async ({ locals, url }) => {

    if (!locals.saasId || !locals.authedUser?.uid) {
        throw redirect(302, '/')
    }

    if (!await hasRole('user', locals)) throw redirect(302, '/app')

    let limit = Number(url.searchParams.get('l'))
    if (!limit || !Number.isInteger(limit) || limit > 200 || limit < 10) limit = 10

    let offset = Number(url.searchParams.get('o'))
    if (!offset || !Number.isInteger(offset)) offset = 0

    let filters = url.searchParams.get('f')
    if (!filters) filters = '{}'

    let searches = url.searchParams.get('s')
    if (!searches) searches = '{}'

    const download = url.searchParams.get('download')


    const polizas = await listPolizas({
        saasId: locals.saasId,
        limit,
        offset,
        filters,
        searches,
        download: download === '1'
    })

    return json(polizas)
}