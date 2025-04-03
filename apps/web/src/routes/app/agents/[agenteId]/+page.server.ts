import { AppError } from '$lib/ApplicationError.js';
import { hasRole } from '$lib/auth/hasRole.js';
import { updateAgenteUsecase } from '$useCases/agentes/updateAgenteUsecase.js';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals, params }) => {
    if (!await hasRole('admin', locals)) {
        throw redirect(302, '/app');
    }
    if (!locals.saasId || !locals.authedUser?.email) throw new AppError(`No se pudo identificar al usuario.`);

    return { agenteId: params.agenteId }
}
export const actions = {
    save: async ({ request, locals }) => {
        try {
            if (!await hasRole('admin', locals)) {
                throw redirect(302, '/app');
            }
            if (!locals.saasId) throw new AppError('No se puede obtener el SaasId de la petición.')

            const data = await request.formData()
            let name = data.get('name') as string | undefined
            let alias = data.get('alias') as string | undefined
            let email = data.get('email') as string | undefined
            let tel = data.get('tel') as string | undefined
            let newQualitasId = data.get('newQualitasId') as string | undefined
            let newAnaId = data.get('newAnaId') as string | undefined
            const conductoId = Number(data.get('conductoId'))
            const id = Number(data.get('id'))

            if (typeof name !== 'string') name = undefined
            if (typeof alias !== 'string') alias = undefined
            if (typeof email !== 'string') email = undefined
            if (typeof tel !== 'string') tel = undefined
            if (typeof newQualitasId !== 'string') newQualitasId = undefined
            if (typeof newAnaId !== 'string') newAnaId = undefined

            const agente = await updateAgenteUsecase({
                id, name, alias, email, tel, newQualitasId, newAnaId, conductoId, saasId: locals.saasId
            })
            return { agente }
        } catch (error) {
            console.warn(error)
            const message = error instanceof AppError ? error.message : 'Ha ocurrido un error inesperado.'
            return fail(400, { message })
        }
    }
}
