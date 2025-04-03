import { AppError } from '$lib/ApplicationError.js';
import { hasRole } from '$lib/auth/hasRole.js';
import { updateConductoUsecase } from '$useCases/conductos/updateConductoUsecase.js';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals, params }) => {
    if (!await hasRole('admin', locals)) {
        throw redirect(302, '/app');
    }
    if (!locals.saasId || !locals.authedUser?.email) throw new Error(`No se pudo identificar al usuario.`);

    return { conductId: params.conductId }
}
export const actions = {
    save: async ({ request, locals }) => {
        try {
            if (!await hasRole('admin', locals)) {
                throw redirect(302, '/app');
            }
            if (!locals.saasId) throw ('No se puede obtener el SaasId de la petición.')

            const data = await request.formData()
            let name = data.get('name') as string | undefined
            let alias = data.get('alias') as string | undefined
            let email = data.get('email') as string | undefined
            let tel = data.get('tel') as string | undefined
            const id = Number(data.get('id'))

            if (typeof name !== 'string') name = undefined
            if (typeof alias !== 'string') alias = undefined
            if (typeof email !== 'string') email = undefined
            if (typeof tel !== 'string') tel = undefined
            if (Number.isNaN(id)) throw new AppError('Parámetro incorrecto, no se encontró el conducto que intenta actualizar.')

            const conducto = await updateConductoUsecase({
                id, name, alias, email, tel, saasId: locals.saasId
            })
            return { conducto }
        } catch (error) {
            const message = error instanceof AppError ? error.message : 'Revisa los datos e inténtalo nuevamente.'
            return fail(400, { message })
        }
    }
}
