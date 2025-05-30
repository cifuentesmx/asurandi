import { hasRole } from '$lib/auth/hasRole.js'
import { redirect } from '@sveltejs/kit'
import { addQualitasAccountUsecase } from '$useCases/cuenta/addQualitasAccountUsecase.js';
import { updateQualitasAccountUsecase } from '$useCases/cuenta/updateQualitasAccountUsecase.js';
import { deleteQualitasAccountUsecase } from '$useCases/cuenta/deleteQualitasAccountUsecase.js';

export const actions = {
    addAccount: async ({ locals, request }) => {
        try {
            if (!await hasRole('admin', locals)) {
                throw redirect(302, '/app');
            }

            if (!locals.saasId || !locals.authedUser?.email) throw new Error(`No se pudo agregar la cuenta`);
            const data = await request.formData()
            const agente = data.get('agente')
            const cuenta = data.get('cuenta')
            const password = data.get('password')
            const alias = data.get('alias')
            const company = data.get('company')


            if (typeof agente !== 'string') throw new Error('No se encuentra el agente para dar de alta la cuenta.')
            if (typeof cuenta !== 'string') throw new Error('No se encuentra la cuenta para dar de alta.')
            if (typeof password !== 'string') throw new Error('No se ha recibido la contraseña.')
            if (typeof alias !== 'string') throw new Error('No se ha recibido el alias de la cuenta.')
            if (typeof company !== 'string') throw new Error('No se ha recibido la compañía de la cuenta.')

            const account = await addQualitasAccountUsecase({
                saasId: locals.saasId,
                agente,
                cuenta,
                password,
                alias,
                company
            })
            return { message: `La cuenta "${cuenta}" se ha agregado correctamente.`, account }

        } catch (error) {
            console.error(`${new Date()}`, error)
            throw new Error(`No se pudo agregar la cuenta especificada. Reinténtelo más tarde.`);

        }
    },
    updateAccount: async ({ locals, request }) => {
        try {
            if (!await hasRole('admin', locals)) {
                throw redirect(302, '/app');
            }

            if (!locals.saasId || !locals.authedUser?.email) throw new Error(`No se pudo localizar la cuenta`);
            const data = await request.formData()
            const agente = data.get('agente')
            const cuenta = data.get('cuenta')
            const alias = data.get('alias')
            let password = data.get('password')
            const company = data.get('company')


            if (typeof agente !== 'string') throw new Error('No se encuentra el agente para dar de alta la cuenta.')
            if (typeof cuenta !== 'string') throw new Error('No se encuentra la cuenta para dar de alta.')
            if (typeof alias !== 'string') throw new Error('No se ha recibido el alias de la cuenta.')
            if (typeof password !== 'string') password = null
            if (typeof company !== 'string') throw new Error('No se ha recibido la compañía de la cuenta.')

            const account = await updateQualitasAccountUsecase({
                saasId: locals.saasId,
                agente,
                cuenta,
                password,
                alias,
                company
            })
            return { message: `La cuenta "${cuenta}" se ha agregado correctamente.`, account }

        } catch (error) {
            console.error(`${new Date()}`, error)
            throw new Error(`No se pudo actualizar la cuenta. Reinténtelo más tarde.`);

        }
    },
    deleteAccount: async ({ locals, request }) => {
        try {
            if (!await hasRole('admin', locals)) {
                throw redirect(302, '/app');
            }

            if (!locals.saasId || !locals.authedUser?.email) throw new Error(`No se pudo localizar la cuenta`);
            const data = await request.formData()
            const id = data.get('id')
            if (typeof id !== 'string') throw new Error('No se encuentra el agente para dar de alta la cuenta.')
            const company = data.get('company')
            if (typeof company !== 'string') throw new Error('No se ha recibido la compañía de la cuenta.')

            const ok = await deleteQualitasAccountUsecase({
                saasId: locals.saasId,
                id,
                company
            })
            return { message: `La cuenta "${id}" se ha borrado correctamente.`, ok }

        } catch (error) {
            console.error(`${new Date()}`, error)
            throw new Error(`No se pudo actualizar la cuenta. Reinténtelo más tarde.`);

        }
    },
}
