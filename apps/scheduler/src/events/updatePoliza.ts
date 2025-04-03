import { handleScrapped } from '../pg-service/handleScrapped.js';
import { PolizaSiniestroUpdateRequest, MessageBusMessage } from "@asurandi/types";
import { QualitasPortalSession } from "../qualitas/QualitasPortalSession.js";

export async function updatePoliza(request: MessageBusMessage<PolizaSiniestroUpdateRequest>): Promise<void> {
    const portalSession = new QualitasPortalSession({
        saasId: request.payload.saasId,
        agent: request.payload.agent,
        cuenta: request.payload.cuenta,
    })

    try {
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
        await portalSession.close()
    }
}