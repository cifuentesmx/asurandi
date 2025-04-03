import { AppError } from '$lib/ApplicationError.js';
import { hasRole } from '$lib/auth/hasRole';
import { createAgenteUsecase } from '$useCases/agentes/createAgenteUsecase.js';
import { fail, redirect } from '@sveltejs/kit'

export const actions = {
    createAgent: async ({ request, locals }) => {
        try {
            if (!await hasRole('admin', locals)) {
                throw redirect(302, '/app');
            }
            if (!locals.saasId) throw new Error('No se puede encontrar el SaasId desde la petición.')

            const data = await request.formData()
            const name = data.get('name') as string | undefined
            let alias = data.get('alias') as string | undefined
            const email = data.get('email') as string | undefined
            let tel = data.get('tel') as string | undefined
            let qualitasId = data.get('qualitasId') as string | undefined
            let anaId = data.get('anaId') as string | undefined
            const createAditional = data.get('aditional') as string

            if (typeof name !== 'string' || name.length < 3) throw new AppError("El nombre del agente debe contener por lo menos 3 caracteres.");
            if (typeof alias !== 'string' || alias.length < 1) alias = undefined

            if (typeof email !== 'string') throw new AppError("El correo electrónico del agente es requerido.");

            if (typeof tel !== 'string') tel = undefined
            if (typeof qualitasId !== 'string') qualitasId = undefined
            if (typeof anaId !== 'string') anaId = undefined

            const agente = await createAgenteUsecase({
                name, alias, email, tel, qualitasId, anaId, saasId: locals.saasId, createAditional: createAditional === 'on'
            })
            return { ok: true, agente }
        } catch (error) {
            console.warn(error)
            const message = error instanceof AppError ? error.message : 'Revise los datos e inténtelo nuevamente.'
            return fail(400, { message })
        }
    }
}