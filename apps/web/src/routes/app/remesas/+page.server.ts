import { redirect } from '@sveltejs/kit';
import { uploadRemesasQualitasUsecase } from '../../../useCases/remesas/uploadRemesasQualitasUsecase.js';
import { hasRole } from '$lib/auth/hasRole.js';
import { listConductos } from '$api/conducto/listConductos.js';
import { listAgentes } from '$api/agentes/listAgentes.js';
import { AppError } from '$lib/ApplicationError.js';

export const actions = {
    subirDecena: async ({ request, locals }) => {

        if (!locals.saasId || !locals.authedUser?.uid) {
            throw redirect(302, '/')
        }

        if (!await hasRole('finanzas', locals)) throw redirect(302, '/app')

        try {
            const data = await request.formData();
            const files = data.getAll('files');

            if (files.length === 0) throw new AppError("No se recibieron archivos válidos para ser procesados.");
            for (const file of files) {
                if (!(file instanceof Blob)) {
                    return
                }

                const buffer = await file.arrayBuffer(); // Usamos text() en lugar de arrayBuffer()
                if (!buffer) return false
                await uploadRemesasQualitasUsecase(buffer, locals.saasId)
            }

            return {
                success: true
            };
        } catch (error) {
            const message = error instanceof AppError ? error.message : 'Ocurrió un errror al procesar los archivos.'
            console.error(message)
            return {
                success: false,
                error: message
            };
        }
    }
}

export const load = async ({ locals }) => {
    if (!await hasRole('finanzas', locals)) {
        throw redirect(302, '/app');
    }
    if (!locals.saasId || !locals.authedUser?.email) throw new Error(`No se pudo identificar al usuario.`);

    const { conductos } = await listConductos({ saasId: locals.saasId })
    const { agentes } = await listAgentes({ saasId: locals.saasId })
    return { conductos, agentes }
}