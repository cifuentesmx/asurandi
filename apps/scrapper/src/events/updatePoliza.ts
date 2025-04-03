import { handleScrapped } from '../database/handleScrapped.js';
import { UpdateRequestPoliza, MessageBusMessage } from "@asurandi/types";
import { QualitasPortalSession } from "../qualitas/QualitasPortalSession.js";

export async function updatePoliza(request: MessageBusMessage<UpdateRequestPoliza>): Promise<void> {
    let portalSession: QualitasPortalSession | null = null
    if (request.payload.company === 'qualitas') {
        portalSession = new QualitasPortalSession({
            saasId: request.payload.saasId,
            agent: request.payload.agent,
            cuenta: request.payload.cuenta,
        })
    } else if (request.payload.company === 'anaseguros') {
        // TODO Add your code here for 'anaseguros'
    } else {
        // TODO intentar obtener la compañia desde la base de datos de una poliza existente
    }


    try {
        if (!portalSession) throw new Error('No se pudo crear la sesión en la compañia ' + request.payload.company)
        await portalSession.open()
        const scrappedPoliza = await portalSession.updatePoliza(request.payload.numeroPoliza)
        return handleScrapped(scrappedPoliza, `${request.payload.agent}-${request.payload.cuenta}`)
    } catch (error) {
        if (error instanceof Error)
            console.error(`${new Date()} - ${error?.message}`)
        else {
            console.error(`${new Date()} - `, error)
        }
    } finally {
        if (portalSession) await portalSession.close()
    }
}