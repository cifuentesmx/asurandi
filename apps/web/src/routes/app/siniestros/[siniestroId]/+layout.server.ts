import { getSiniestro } from '$api/siniestros/getSiniestro.js';
import { hasRole } from '$lib/auth/hasRole.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, params }) => {
    if (!await hasRole('siniestros', locals)) {
        throw redirect(302, '/app');
    }
    if (!locals.saasId || !locals.authedUser?.email) throw new Error(`No se pudo identificar al usuario.`);

    const siniestro = await getSiniestro({ saasId: locals.saasId, id: parseInt(params.siniestroId) })
    return { siniestro }
}