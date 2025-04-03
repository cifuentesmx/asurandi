import { listComisionesDetalles } from '$api/comisiones/detalles/listComisionesDetalles.js';
import { hasRole } from '$lib/auth/hasRole.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, params, url }) => {
    if (!await hasRole('emisiones', locals)) {
        throw redirect(302, '/app');
    }
    if (!locals.saasId || !locals.authedUser?.email) throw new Error(`No se pudo identificar al usuario.`);

    const ids = params.compoundId.split('-')

    const agenteId = Number(ids[0])
    const conductoId = Number(ids[1])
    let filters = url.searchParams.get('f')
    if (typeof filters !== 'string') filters = '{}'

    const { data } = await listComisionesDetalles({ saasId: locals.saasId, agenteId, conductoId, filters })
    const dates = JSON.parse(url.searchParams.get('f') ?? '{}')
    return { data, dates }
}