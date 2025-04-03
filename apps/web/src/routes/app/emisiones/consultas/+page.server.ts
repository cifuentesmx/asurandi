import { listAgentes } from '$api/agentes/listAgentes.js';
import { listModoPagos } from '$api/catalogos/listModoPago.js';
import { listPolizaOrigen } from '$api/catalogos/listPolizaOrigen.js';
import { listPolizaStatus } from '$api/catalogos/listPolizaStatus.js';
import { listServicios } from '$api/catalogos/listServicios.js';
import { listSubRamos } from '$api/catalogos/listSubramos.js';
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
        listServicios(),
        listSubRamos(),
        listModoPagos(),
        listPolizaOrigen()
    ])

    const conductos = res[0].status === 'fulfilled' ? res[0].value.conductos : undefined
    const agentes = res[1].status === 'fulfilled' ? res[1].value.agentes : undefined
    const servicios = res[2].status === 'fulfilled' ? res[2].value.servicios : undefined
    const subRamos = res[3].status === 'fulfilled' ? res[3].value.subRamos : undefined
    const modoPagos = res[4].status === 'fulfilled' ? res[4].value.modoPagos : undefined
    const origenes = res[5].status === 'fulfilled' ? res[5].value.origenes : undefined

    const { polizaStatus } = listPolizaStatus()

    return { conductos, agentes, servicios, subRamos, modoPagos, polizaStatus, origenes }
}