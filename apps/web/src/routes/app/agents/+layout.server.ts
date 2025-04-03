import { listAgentes } from '$api/agentes/listAgentes.js';
import { listConductos } from '$api/conducto/listConductos.js';
import { hasRole } from '$lib/auth/hasRole.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
    if (!await hasRole('admin', locals)) {
        throw redirect(302, '/app');
    }
    if (!locals.saasId || !locals.authedUser?.email) throw new Error(`No se pudo identificar al usuario.`);

    const { conductos } = await listConductos({ saasId: locals.saasId })
    const { agentes } = await listAgentes({ saasId: locals.saasId })
    return { conductos, agentes }
}