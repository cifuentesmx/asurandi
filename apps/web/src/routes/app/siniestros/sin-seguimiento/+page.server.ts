import { listAgentes } from '$api/agentes/listAgentes.js';
import { listSiniestroCausa } from '$api/catalogos/listSiniestroCausa.js';
import { listConductos } from '$api/conducto/listConductos.js';
import { hasRole } from '$lib/auth/hasRole.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
    if (!await hasRole('user', locals)) {
        throw redirect(302, '/app');
    }
    if (!locals.saasId || !locals.authedUser?.email) throw new Error(`No se pudo identificar al usuario.`);

    const { conductos } = await listConductos({ saasId: locals.saasId })
    const { agentes } = await listAgentes({ saasId: locals.saasId })
    const { siniestroCausas } = await listSiniestroCausa()
    return { conductos, agentes, siniestroCausas }
}

