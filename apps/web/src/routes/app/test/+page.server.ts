import { AppError } from '$lib/ApplicationError.js';
import { hasRole } from '$lib/auth/hasRole.js';
import { redirect } from '@sveltejs/kit';

import { testWhatsappUseCase } from '$useCases/agentes/testWhatsappUsecase.js';

export const actions = {
    test: async ({ locals }) => {

        if (!locals.saasId || !locals.authedUser?.uid) {
            throw redirect(302, '/')
        }

        if (!await hasRole('admin', locals)) throw redirect(302, '/app')

        try {
            await testWhatsappUseCase()
            return {
                success: true
            };
        } catch (error) {
            const message = error instanceof AppError ? error.message : 'Ocurrió un errror al procesar los archivos.'
            console.error(error)
            return {
                success: false,
                error: message
            };
        }
    }
}