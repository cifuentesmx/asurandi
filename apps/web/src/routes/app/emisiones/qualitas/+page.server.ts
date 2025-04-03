import { getQualitasAccount } from '$api/accounts/getQualitasAccount.js';
import { listQualitasAccounts } from '$api/accounts/listQualitasAccounts.js';
import { AppError } from '$lib/ApplicationError.js';
import { hasRole } from '$lib/auth/hasRole.js';
import { processQualitasDayUsecase } from '$useCases/poliza/processQualitasDayUsecase.js';
import { resgisterPolizaUsecase } from '$useCases/poliza/registerPolizaUsecase';
import { fail, redirect } from '@sveltejs/kit';
export const actions = {
    registrarPoliza: async ({ request, locals }) => {
        try {
            if (!await hasRole('emisiones', locals)) {
                throw redirect(302, '/app');
            }

            if (!locals.saasId || !locals.authedUser?.email) throw new AppError(`No se pudo identificar al usuario.`);
            const data = await request.formData();

            const cuentaId = data.get('cuentaId')
            const poliza = data.get('poliza')

            if (typeof cuentaId !== 'string') throw new AppError("No se identificó a la cuenta del agente para la compañía solicitada.");
            if (typeof poliza !== 'string') throw new AppError("No se recibió un número de poliza.");

            const cuenta = await getQualitasAccount(locals.saasId, cuentaId)
            if (!cuenta ||
                typeof cuenta.cuenta !== 'string' ||
                typeof cuenta.agente !== 'string')
                throw new AppError("No se ha podido obtener la cuenta de agente para registrar la póliza");


            await resgisterPolizaUsecase({
                company: 'qualitas',
                cuenta: cuenta.cuenta,
                poliza,
                agent: cuenta.agente,
                saasId: locals.saasId
            })
            return { ok: true }
        } catch (error) {
            const message = error instanceof AppError ? error.message : 'Ocurrió un errror al intentar registrar la póliza.'
            console.error(error)
            return fail(400, { message })
        }
    },

    procesarDia: async ({ request, locals }) => {
        try {
            if (!await hasRole('emisiones', locals)) {
                throw redirect(302, '/app');
            }

            if (!locals.saasId || !locals.authedUser?.email) throw new AppError(`No se pudo identificar al usuario.`);
            const data = await request.formData();

            const day = data.get('day')

            if (typeof day !== 'string') throw new AppError("No se recibió el día para procesar.");

            await processQualitasDayUsecase({
                company: 'qualitas',
                day: day,
                saasId: locals.saasId
            })
            return { ok: true }
        } catch (error) {
            const message = error instanceof AppError ? error.message : 'Ocurrió un errror al intentar agregar la tarea en segundo plano.'
            console.error(error)
            return fail(400, { message })
        }
    }
}

export const load = async ({ locals }) => {
    if (!await hasRole('emisiones', locals)) {
        throw redirect(302, '/app');
    }
    if (!locals.saasId || !locals.authedUser?.email) throw new AppError(`No se pudo identificar al usuario.`);

    const qualitasAccounts = await listQualitasAccounts(locals.saasId)
    return { qualitasAccounts }
}