import { listAgentes } from '$api/agentes/listAgentes.js';
import { listSiniestroCausa } from '$api/catalogos/listSiniestroCausa.js';
import { listConductos } from '$api/conducto/listConductos.js';
import { AppError } from '$lib/ApplicationError.js';
import { hasRole } from '$lib/auth/hasRole.js';
import { storageSaveFile } from '$lib/firebase/storageSaveFile.js';
import { cerrarSiniestroUseCase } from '$useCases/siniestros/cerrarSiniestroUsecase.js';
import { registrarActividadSeguimientoSiniestroUseCase } from '$useCases/siniestros/registrarActividadSeguimientoSiniestroUsecase.js';
import { toggleSeguimientoUsecase } from '$useCases/siniestros/toggleSeguimientoUsecase.js';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
    if (!await hasRole('user', locals)) {
        throw redirect(302, '/app');
    }
    if (!locals.saasId || !locals.authedUser?.email) throw new Error(`No se pudo identificar al usuario.`);

    const { conductos } = await listConductos({ saasId: locals.saasId })
    const { agentes } = await listAgentes({ saasId: locals.saasId })
    const { siniestroCausas } = await listSiniestroCausa()
    return { conductos, agentes, siniestroCausas }
}

export const actions = {
    registrarActividad: async ({ locals, request }) => {
        if (!locals.saasId || !locals.authedUser?.uid) {
            throw redirect(302, '/')
        }

        try {
            if (!await hasRole('siniestros', locals)) throw redirect(302, '/app')
            if (!locals.authedUser.email) throw new AppError('No se ha encontrado al usuario para completar esta acción.')

            const data = await request.formData();
            const files = data.getAll('files');
            const comentario = data.get('comentarios')
            if (typeof comentario !== 'string' || !comentario) throw new AppError("No se ha recibido el texto para registrar la actividad.");
            const siniestroId = Number(data.get('siniestroId'))
            if (typeof siniestroId !== 'number' || Number.isNaN(siniestroId)) throw new AppError('No se ha recibido el número de siniestro correctamente.')

            const urls = await storageSaveFile({ files, storagePath: `p/${locals.saasId}/siniestros/${siniestroId}` })
            const actividad = await registrarActividadSeguimientoSiniestroUseCase({
                urls, comentario, siniestroId,
                saasId: locals.saasId,
                user: locals.authedUser.email,
            })


            return { ok: true, actividad }

        } catch (error) {
            const message = error instanceof AppError ? error.message : 'Ocurrió un errror al intentar agregar el registro para el siniestro.'
            console.error(error)
            return fail(400, { message })
        }
    },
    cerrarSiniestro: async ({ locals, request }) => {
        if (!locals.saasId || !locals.authedUser?.uid) {
            throw redirect(302, '/')
        }

        try {
            if (!await hasRole('siniestros', locals)) throw redirect(302, '/app')
            if (!locals.authedUser.email) throw new AppError('No se ha encontrado al usuario para completar esta acción.')

            const data = await request.formData();
            const files = data.getAll('files');
            const comentario = data.get('comentarios')
            if (typeof comentario !== 'string' || !comentario) throw new AppError("No se ha recibido el texto para el cierre del siniestro.");
            const siniestroId = Number(data.get('siniestroId'))
            if (typeof siniestroId !== 'number' || Number.isNaN(siniestroId)) throw new AppError('No se ha recibido el número de siniestro correctamente.')

            const urls = await storageSaveFile({ files, storagePath: `p/${locals.saasId}/siniestros/${siniestroId}` })
            const actividad = await cerrarSiniestroUseCase({
                urls, comentario, siniestroId,
                saasId: locals.saasId,
                user: locals.authedUser.email,
            })


            return { ok: true, actividad }

        } catch (error) {
            const message = error instanceof AppError ? error.message : 'Ocurrió un errror al intentar agregar el registro para el siniestro.'
            console.error(error)
            return fail(400, { message })
        }
    },
    toggleSeguimiento: async ({ locals, request }) => {
        if (!locals.saasId || !locals.authedUser?.uid) {
            throw redirect(302, '/')
        }

        try {
            if (!await hasRole('siniestros', locals)) throw redirect(302, '/app')
            if (!locals.authedUser.email) throw new AppError('No se ha encontrado al usuario para completar esta acción.')

            const data = await request.formData();
            const siniestroId = Number(data.get('siniestroId'))
            if (typeof siniestroId !== 'number' || Number.isNaN(siniestroId)) throw new AppError('No se ha recibido el número de siniestro correctamente.')

            const enSeguimiento = data.get('enSeguimiento') === 'on'
            const siniestro = await toggleSeguimientoUsecase({
                siniestroId,
                saasId: locals.saasId,
                enSeguimiento,

            })


            return { ok: true, siniestro }

        } catch (error) {
            const message = error instanceof AppError ? error.message : 'Ocurrió un errror al actualizar el seguimiento al siniestro.'
            console.error(error)
            return fail(400, { message })
        }
    }
}