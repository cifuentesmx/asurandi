import { unauthorized } from "$api/responses.js"
import { AppError } from "$lib/ApplicationError.js"
import { hasRole } from "$lib/auth/hasRole.js"
import { updateRenovacionStatusUsecase } from "$useCases/renovaciones/updateRenovacionStatusUsecase.js"
import { json, redirect } from "@sveltejs/kit"

export const POST = async ({ locals, params, request }) => {

    try {
        if (!locals.saasId || !locals.authedUser?.uid) {
            throw redirect(302, '/')
        }

        if (!await hasRole('emisiones', locals)) return unauthorized()

        const data = await request.json()


        const renovacionId = Number(params.renovacionId)
        if (!renovacionId || Number.isNaN(renovacionId)) throw new AppError("No se puede obtener el parámetro");

        const newStatus = data.newStatus
        if (!newStatus) throw new AppError("No se ha obtenido el nuevo status de la renovación.");

        const validStatus = ['PENDIENTE', 'RENOVADA', 'NO RENOVADA']
        if (!validStatus.includes(newStatus)) throw new Error("El nuevo status es inválido.");

        const renovacion = await updateRenovacionStatusUsecase({
            saasId: locals.saasId,
            id: renovacionId,
            newStatus
        })

        return json({ ok: true, renovacion })
    } catch (error) {
        console.error(error)
        const message = error instanceof AppError ? error.message : 'Error al intentar actualizar el estado de la renovación.'
        return json({ message }, { status: 400 })
    }
}