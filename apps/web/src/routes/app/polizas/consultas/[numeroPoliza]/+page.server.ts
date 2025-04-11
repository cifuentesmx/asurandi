import { getPolizaByNumero } from "$api/polizas/getPolizaByNumero";
import { hasRole } from "$lib/auth/hasRole.js";
import { redirect } from "@sveltejs/kit";

export const load = async ({ locals, params }) => {
    if (!locals.saasId || !locals.authedUser?.email) throw new Error(`No se pudo identificar al usuario.`);

    if (!await hasRole('user', locals)) {
        throw redirect(302, '/app');
    }

    return await getPolizaByNumero({ saasId: locals.saasId, numeroPoliza: params.numeroPoliza })
}