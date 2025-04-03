import { getPolizaByNumero } from "$api/polizas/getPolizaByNumero";

export const load = async ({ locals, params }) => {
    if (!locals.saasId || !locals.authedUser?.email) throw new Error(`No se pudo identificar al usuario.`);

    return await getPolizaByNumero({ saasId: locals.saasId, numeroPoliza: params.numeroPoliza })
}