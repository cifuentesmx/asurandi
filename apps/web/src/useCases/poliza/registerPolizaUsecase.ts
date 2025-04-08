import { sendToMessageBus } from "$lib/sendRabbitMessage"
import type { Aseguradoras, MessageBusMessage, UpdateRequestPoliza } from "@asurandi/types"

export const resgisterPolizaUsecase = async ({
    company,
    agent,
    poliza,
    saasId,
    cuenta,
}: {
    company: Aseguradoras,
    agent: string,
    poliza: string,
    saasId: string,
    cuenta: string
}) => {
    const updateRequest: UpdateRequestPoliza = {
        agent,
        intents: 0,
        company,
        numeroPoliza: poliza,
        saasId,
        cuenta,
    }
    const msg: MessageBusMessage<UpdateRequestPoliza> = {
        exchange: 'ex.scrapper',
        intents: 0,
        maxIntents: 5,
        payload: updateRequest,
        retry_ttl: 10_000,
        routingKey: 'poliza',
        ttl: 600_000

    }

    await sendToMessageBus(msg)
    return
}