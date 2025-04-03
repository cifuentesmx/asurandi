import { updateCobroStatusUsecase } from '$useCases/cobros/updateCobroStatusUsecase';
import { unauthorized } from "$api/responses.js"
import { AppError } from "$lib/ApplicationError.js"
import { hasRole } from "$lib/auth/hasRole.js"
import { json, redirect } from "@sveltejs/kit"

export const PUT = async ({ locals, params, request }) => {

    try {
        if (!locals.saasId || !locals.authedUser?.uid) {
            throw redirect(302, '/')
        }

        if (!await hasRole('finanzas', locals)) return unauthorized()
        const data = await request.json()
        const cobroId = Number(params.cobroId)
        if (!cobroId || Number.isNaN(cobroId)) throw new AppError("No se puede obtener el parámetro");

        const newStatus = data.newStatus
        if (!newStatus) throw new AppError("No se ha obtenido el nuevo status del cobro.");

        const validStatus = ['PENDIENTE', 'PAGADA', 'VENCIDA', 'CANCELADA']
        if (!validStatus.includes(newStatus)) throw new Error("El nuevo status es inválido.");

        const cobro = await updateCobroStatusUsecase({
            saasId: locals.saasId,
            id: cobroId,
            newStatus
        })

        return json({ ok: true, cobro })
    } catch (error) {
        console.error(error)
        const message = error instanceof AppError ? error.message : 'Error al intentar actualizar el estado del cobro.'
        return json({ message }, { status: 400 })
    }
}