import { hasRole } from '$lib/auth/hasRole.js'
import { addUserUsecase } from '$useCases/users/addUserUsecase.js';
import { redirect } from '@sveltejs/kit'
import { deleteUserUsecase } from '$useCases/users/deleteUserUsecase .js';
import { _validEmail } from '$lib/helpers/_validEmail.js';
import type { SaasRole } from '@asurandi/types';

export const actions = {
    addUser: async ({ locals, request }) => {
        try {
            if (!await hasRole('admin', locals)) {
                throw redirect(302, '/app');
            }

            if (!locals.saasId || !locals.authedUser?.email) throw new Error(`No se pudo agregar la cuenta`);
            const data = await request.formData()
            const email = data.get('email')
            const roles = data.get('roles')


            if (typeof email !== 'string') throw new Error('No se encuentra el correo electrónico')

            if (!_validEmail(email)) throw new Error('El correo es inválido.')

            if (typeof roles !== 'string') throw new Error('No se recibieron los roles a aplicar.')

            const acceptedRoles = ['admin', 'emisiones', 'finanzas', 'agente', 'conducto', 'user']
            const theRoles = roles.split(',').filter(t => {
                return acceptedRoles.includes(t)
            }) as SaasRole[]



            const user = await addUserUsecase(locals.saasId, email, theRoles)
            return { message: `Usuario agregado correctamente.`, user }

        } catch (error) {
            console.error(`${new Date()}`, error)
            throw new Error(`No se pudo agregar el usuario especificado. Reinténtelo más tarde.`);

        }
    },
    deleteUser: async ({ locals, request }) => {
        try {
            if (!await hasRole('admin', locals)) {
                throw redirect(302, '/app');
            }

            if (!locals.saasId || !locals.authedUser?.email) throw new Error(`No se pudo localizar la cuenta de usuario. No se puede borrar usuario`);
            const data = await request.formData()
            const id = data.get('id')



            if (typeof id !== 'string') throw new Error('No se recibió el ID del usuario para borrar.')


            const user = await deleteUserUsecase(locals.saasId, id)
            return { message: `Usuario agregado correctamente.`, user }

        } catch (error) {
            console.error(`${new Date()}`, error)
            throw new Error(`No se pudo guardar los datos. Reinténtelo más tarde.`);

        }
    }

}
