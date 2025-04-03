import { redirect } from '@sveltejs/kit';
import { hasRole } from '$lib/auth/hasRole.js';
import { listConductos } from '$api/conducto/listConductos.js';
import { listAgentes } from '$api/agentes/listAgentes.js';


export const load = async ({ locals }) => {
    if (!await hasRole('finanzas', locals)) {
        throw redirect(302, '/app');
    }
    if (!locals.saasId || !locals.authedUser?.email) throw new Error(`No se pudo identificar al usuario.`);

    const { conductos } = await listConductos({ saasId: locals.saasId })
    const { agentes } = await listAgentes({ saasId: locals.saasId })
    return { conductos, agentes }
}