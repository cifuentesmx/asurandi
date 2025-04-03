import { hasRole } from "$lib/auth/hasRole"
import { json, redirect } from "@sveltejs/kit"
import { listComisiones } from "./listComisiones"

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

    const polizas = await listComisiones({
        saasId: locals.saasId,
        limit,
        offset,
        filters
    })

    return json(polizas)
}