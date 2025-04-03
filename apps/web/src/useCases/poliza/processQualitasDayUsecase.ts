import { sendToMessageBus } from "$lib/sendRabbitMessage"
import type { MessageBusMessage, PolizaSiniestroUpdateRequestRange, Aseguradoras } from "@asurandi/types"

export const processQualitasDayUsecase = async ({
    company, day, saasId
}: { company: Aseguradoras, day: string, saasId: string }) => {
    const updateRequest: PolizaSiniestroUpdateRequestRange = {
        intents: 0,
        company,
        start: day,
        end: day,
        saasId,
    }
    const msg: MessageBusMessage<PolizaSiniestroUpdateRequestRange> = {
        exchange: 'ex.scrapper',
        intents: 0,
        maxIntents: 5,
        payload: updateRequest,
        retry_ttl: 10_000,
        routingKey: 'daily',
        ttl: 3_600_000
    }
    await sendToMessageBus(msg)

}