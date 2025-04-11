import { PolizasToScrapeFromDaily, UpdateRequestPoliza } from "@asurandi/types"
import { sendToMessageBus } from "../sendMessage.js"

export const qualitasProcessPolizasToScrape = async (polizas: Map<string, PolizasToScrapeFromDaily>,
    saasId: string,
    cuenta: any,
    agente: string,
): Promise<void> => {

    polizas.forEach(async (poliza, numeroPoliza) => {
        const updateRequest: UpdateRequestPoliza = {
            numeroPoliza,
            saasId,
            company: 'qualitas',
            cuenta,
            agent: agente,
            intents: 0,
            dataFromDailyScrapper: poliza
        }

        await sendToMessageBus({
            exchange: 'ex.scrapper',
            routingKey: 'poliza',
            ttl: 14_400_000, // 4 hours
            intents: 0,
            maxIntents: 5,
            payload: updateRequest
        })



    })
}