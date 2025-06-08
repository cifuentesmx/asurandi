import { handleScrapped } from '../database/handleScrapped.js';
import { UpdateRequestPoliza, MessageBusMessage, CompanyPortalSession } from "@asurandi/types";
import { QualitasPortalSession } from "../qualitas/QualitasPortalSession.js";
import { sendToMessageBus } from '../sendMessage.js';
import { getPolizaMaestra } from '../database/getPolizaMaestra.js';
import { AnasegurosPortal } from '../anaseguros/AnasegurosPortal.js';
export async function updatePoliza(request: MessageBusMessage<UpdateRequestPoliza>): Promise<void> {
    console.info(`Solicitud recibida para la poliza: ${request.payload.numeroPoliza}, intentos previos: ${request.intents}  `)

    // Si la poliza ya existe en la base de datos y fue sincronizada en la última 24 horas y 
    // la solicitud viene de un dailyScrapper (trae el atributo dataFromDailyScrapper),
    // entonces no se realiza la sincronización!
    let existingPoliza: Awaited<ReturnType<typeof getPolizaMaestra>> | null = null
    if (request.payload.company && request.payload.saasId &&
        request.payload.numeroPoliza && request.payload.dataFromDailyScrapper) {
        existingPoliza = await getPolizaMaestra(request.payload.numeroPoliza, request.payload.company, request.payload.saasId)
        if (existingPoliza && existingPoliza.lastSync && new Date(existingPoliza.lastSync) > new Date(Date.now() - 1000 * 60 * 60 * 24)) {
            console.info(`La poliza ${request.payload.numeroPoliza} ya se ha sincronizado en la última 24 horas, no se realizará la sincronización`)
            return
        }
    }

    let portalSession: CompanyPortalSession | null = null
    const company = request.payload.company ?? existingPoliza?.companyId ?? null


    try {
        if (company === 'qualitas') {
            portalSession = new QualitasPortalSession({
                saasId: request.payload.saasId,
                agent: request.payload.agent,
                cuenta: request.payload.cuenta,
            })
            await portalSession.open()
            const scrappedPoliza = await portalSession.updatePoliza(request.payload.numeroPoliza)
            if (scrappedPoliza) {
                await handleScrapped(scrappedPoliza, `${request.payload.agent}-${request.payload.cuenta}`, request.payload.dataFromDailyScrapper)
            }
            console.info(`Sincronización de la poliza ${request.payload.numeroPoliza} realizada con éxito`)
        } else if (company === 'anaseguros') {
            portalSession = new AnasegurosPortal({
                saasId: request.payload.saasId,
                agent: request.payload.agent,
                cuenta: request.payload.cuenta,
            })
            await portalSession.open()
            await portalSession.updatePoliza(request.payload.numeroPoliza, request.payload.dataFromDailyScrapper)
            console.info(`Sincronización de la poliza ${request.payload.numeroPoliza} realizada con éxito`)
        } else {
            throw new Error('No se pudo obtener la compañia de la poliza ' + request.payload.numeroPoliza)
        }
        return
    } catch (error) {
        console.error(error)
        request.intents++
        if (request.intents >= request.maxIntents) {
            console.info(`Permanent failure for poliza: ${request.payload.numeroPoliza}, intentos: ${request.intents}`)
            await sendToMessageBus({
                exchange: 'ex.jobs',
                routingKey: 'failed.polizaUpdate',
                reason: error instanceof Error ? error.message : 'Error desconocido',
                ttl: 14_400_000,
                payload: request,
                intents: 1,
                maxIntents: 1
            })
            return
        }
        // temporary failure
        console.info(`Temporary failure for poliza: ${request.payload.numeroPoliza}, intentos: ${request.intents}: Se reintentará en 10 segundos`)
        await sendToMessageBus({
            exchange: 'ex.jobs',
            routingKey: 'waiting.polizaUpdate',
            reason: error instanceof Error ? error.message : 'Error desconocido',
            ttl: 10_000, // retry in 10 seconds
            payload: request,
            intents: request.intents,
            maxIntents: request.maxIntents
        })
        return
    } finally {
        if (portalSession) await portalSession.close()
    }
}