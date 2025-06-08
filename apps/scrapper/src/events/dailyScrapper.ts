import { sendToMessageBus } from "../sendMessage.js";
import { dailyScrapperQualitas } from "./dailyScrapperQualitas.js";
import { MessageBusMessage, UpdateRequestPolizasInRange } from "@asurandi/types";
import { dailyScrapperAna } from "./dailyScrapperAna.js";

export async function dailyScrapper(request: MessageBusMessage<UpdateRequestPolizasInRange>) {
    try {
        await dailyScrapperAna(request)
        await dailyScrapperQualitas(request)
    } catch (error) {
        console.log('error', Date.now().toLocaleString())
        console.error(error)

        request.intents++
        if (request.intents >= request.maxIntents) {
            console.info(`Permanent failure for dailyScrapper: ${request.payload.end}, intentos: ${request.intents}`)
            await sendToMessageBus({
                exchange: 'ex.jobs',
                routingKey: 'failed.dailyScrapper',
                reason: error instanceof Error ? error.message : 'Error desconocido',
                ttl: 14_400_000,
                payload: request,
                intents: 1,
                maxIntents: 1
            })
            return
        }
        // temporary failure
        console.info(`Temporary failure for dailyScrapper: ${request.payload.end}, intentos: ${request.intents}: Se reintentará en 10 segundos`)
        await sendToMessageBus({
            exchange: 'ex.jobs',
            routingKey: 'waiting.dailyScrapper',
            reason: error instanceof Error ? error.message : 'Error desconocido',
            ttl: 10_000, // retry in 1 minute
            payload: request,
            intents: request.intents,
            maxIntents: request.maxIntents
        })
        return
    }
}