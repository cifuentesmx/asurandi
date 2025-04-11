import { hasRole } from '$lib/auth/hasRole.js'
import { redirect } from '@sveltejs/kit'
import type { SaasRole } from '@asurandi/types';
import { updateUserUsecase } from '$useCases/users/updateUserUsecase.js';
import { getUser } from '$api/users/getUser.js';

export const actions = {
    updateUser: async ({ locals, request }) => {
        try {
            if (!await hasRole('admin', locals)) {
                throw redirect(302, '/app');
            }

            if (!locals.saasId || !locals.authedUser?.email) throw new Error(`No se pudo localizar la cuenta de usuario. No se pudo modificar usuario`);
            const data = await request.formData()
            const id = data.get('id')
            const roles = data.get('roles')



            if (typeof id !== 'string') throw new Error('No se recibió el ID del usuario para actualizar.')
            if (typeof roles !== 'string') throw new Error('No se recibieron los roles a aplicar.')

            const acceptedRoles = ['admin', 'emisiones', 'finanzas', 'agente', 'conducto', 'user', 'siniestros']
            const theRoles = roles.split(',').filter(t => {
                return acceptedRoles.includes(t)
            }) as SaasRole[]



            const user = await updateUserUsecase(locals.saasId, id, theRoles)
            return { message: `Usuario agregado correctamente.`, user }

        } catch (error) {
            console.error(`${new Date()}`, error)
            throw new Error(`No se pudo guardar los datos. Reinténtelo más tarde.`);

        }
    },
}

export const load = async ({ parent, url, locals }) => {
    if (!locals.saasId || !locals.authedUser?.uid) {
        throw redirect(302, '/')
    }

    if (!await hasRole('admin', locals)) throw redirect(302, '/app')

    const { users } = await parent()
    const id = url.pathname.split('/').splice(-1, 1)[0]
    let user = users.find(t => {
        if (typeof t.id !== 'string') return false
        return id === t.id
    })
    if (!user) {
        user = await getUser(locals.saasId, id)
    }
    return { user }
}