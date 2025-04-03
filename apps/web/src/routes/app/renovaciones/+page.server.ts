import { listAgentes } from '$api/agentes/listAgentes.js';
import { listPolizaStatus } from '$api/catalogos/listPolizaStatus.js';
import { listConductos } from '$api/conducto/listConductos.js';
import { hasRole } from '$lib/auth/hasRole.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
    if (!await hasRole('emisiones', locals)) {
        throw redirect(302, '/app');
    }
    if (!locals.saasId || !locals.authedUser?.email) throw new Error(`No se pudo identificar al usuario.`);

    const res = await Promise.allSettled([
        listConductos({ saasId: locals.saasId }),
        listAgentes({ saasId: locals.saasId }),
    ])

    const conductos = res[0].status === 'fulfilled' ? res[0].value.conductos : undefined
    const agentes = res[1].status === 'fulfilled' ? res[1].value.agentes : undefined

    const { polizaStatus } = listPolizaStatus()

    return { conductos, agentes, polizaStatus }
}