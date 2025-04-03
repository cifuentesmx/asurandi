import { AppError } from '$lib/ApplicationError.js';
import { hasRole } from '$lib/auth/hasRole.js';
import type { PolizaStatus } from '$types/polizas/poliza-estatus.js';
import { assignQualitasAgenteConductoUsecase } from '$useCases/poliza/assignQualitasAgenteConductoUsecase';
import { updatePolizaOrigen } from '$useCases/poliza/updatePolizaOrigen.js';
import { updatePolizaStatus } from '$useCases/poliza/updatePolizaStatus.js';
import { fail, redirect } from '@sveltejs/kit';
export const actions = {
    actualizarConductoAgente: async ({ request, locals }) => {
        try {
            if (!await hasRole('emisiones', locals)) {
                throw redirect(302, '/app');
            }

            if (!locals.saasId || !locals.authedUser?.email) throw new AppError(`No se pudo identificar al usuario.`);
            const data = await request.formData();

            const numeroPoliza = data.get('numeroPoliza')
            const polizaId = Number(data.get('polizaId'))
            const conductoId = Number(data.get('conductoId'))
            const agenteId = Number(data.get('agenteId'))

            if (typeof polizaId !== 'number' || !Number.isInteger(polizaId) || polizaId === 0) throw new AppError("No se recibió el ID de la póliza.");
            if (typeof conductoId !== 'number' || !Number.isInteger(conductoId) || conductoId === 0) throw new AppError("No se recibió el ID del conducto.");
            if (typeof agenteId !== 'number' || !Number.isInteger(agenteId) || agenteId === 0) throw new AppError("No se recibió el ID de la póliza.");
            if (typeof numeroPoliza !== 'string') throw new AppError("No se recibió el numero de póliza.");

            await assignQualitasAgenteConductoUsecase({
                saasId: locals.saasId,
                numeroPoliza,
                polizaId,
                conductoId,
                agenteId,
                userEmail: locals.authedUser.email
            })
            return { ok: true }
        } catch (error) {
            console.warn(error)
            const message = error instanceof AppError ? error.message : 'Ha ocurrido un error inesperado.'
            return fail(400, { message })
        }
    },
    actualizarEstado: async ({ request, locals }) => {
        try {
            if (!await hasRole('emisiones', locals)) {
                throw redirect(302, '/app');
            }

            if (!locals.saasId || !locals.authedUser?.email) throw new AppError(`No se pudo identificar al usuario.`);
            const data = await request.formData();

            const polizaId = Number(data.get('polizaId'))
            const newStatus = data.get('newStatus') as unknown as PolizaStatus

            const statuses = [
                'Emitida',
                'Pagada',
                'Por vencer',
                'Cancelada',
                'No renovada',
                'Renovada'
            ] as PolizaStatus[];

            if (typeof polizaId !== 'number' || !Number.isInteger(polizaId) || polizaId === 0) throw new AppError("No se recibió el ID de la póliza.");
            if (typeof newStatus !== 'string') throw new AppError("No se recibió el numero de póliza.");
            if (!statuses.includes(newStatus)) throw new AppError(`No se recibió un status válido`);
            if (!locals.authedUser.email) throw new AppError("No se recibió el email del usuario que realiza la acción");



            await updatePolizaStatus({
                saasId: locals.saasId,
                newStatus,
                polizaId,
                userEmail: locals.authedUser.email
            })
            return { ok: true }
        } catch (error) {
            console.warn(error)
            const message = error instanceof AppError ? error.message : 'No se ha podido actualizar el estatus de la póliza.'
            return fail(400, { message })
        }
    },
    actualizarOrigen: async ({ request, locals }) => {
        try {
            if (!await hasRole('emisiones', locals)) {
                throw redirect(302, '/app');
            }

            if (!locals.saasId || !locals.authedUser?.email) throw new AppError(`No se pudo identificar al usuario.`);
            const data = await request.formData()
            const polizaId = Number(data.get('polizaId'))
            const origenId = Number(data.get('origenId'))

            if (typeof polizaId !== 'number' || !Number.isInteger(polizaId) || polizaId === 0) throw new AppError("No se recibió el ID de la póliza.");
            if (typeof origenId !== 'number' || !Number.isInteger(polizaId) || polizaId === 0) throw new AppError("No se recibió el numero de origen de póliza.");
            if (!locals.authedUser.email) throw new AppError("No se recibió el email del usuario que realiza la acción");

            await updatePolizaOrigen({
                saasId: locals.saasId,
                origenId,
                polizaId,
                userEmail: locals.authedUser.email,
            })
            return { ok: true }
        } catch (error) {
            console.warn(error)
            const message = error instanceof AppError ? error.message : 'No se ha podido actualizar el estatus de la póliza.'
            return fail(400, { message })
        }
    },
}

