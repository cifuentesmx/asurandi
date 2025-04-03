import { hasRole } from "$lib/auth/hasRole"
import { json, redirect } from "@sveltejs/kit"
import { listRenovaciones } from "./listRenovaciones"

export const GET = async ({ locals, url }) => {

    if (!locals.saasId || !locals.authedUser?.uid) {
        throw redirect(302, '/')
    }

    if (!await hasRole('emisiones', locals)) throw redirect(302, '/app')

    let limit = Number(url.searchParams.get('l'))
    if (!limit || !Number.isInteger(limit) || limit > 200 || limit < 10) limit = 10

    let offset = Number(url.searchParams.get('o'))
    if (!offset || !Number.isInteger(offset)) offset = 0

    let filters = url.searchParams.get('f')
    if (!filters) filters = '{}'

    let searchs = url.searchParams.get('s')
    if (!searchs) searchs = '{}'

    const download = url.searchParams.get('download')

    const polizas = await listRenovaciones({
        saasId: locals.saasId,
        limit,
        offset,
        filters,
        searchs,
        download: download === '1'

    })

    return json(polizas)
}