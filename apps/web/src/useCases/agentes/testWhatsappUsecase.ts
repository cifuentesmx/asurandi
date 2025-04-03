import { sendToMessageBus } from "$lib/sendRabbitMessage"
import type { OutgoingWhatsappMessageRequest } from "@asurandi/types"
import type { MessageBusMessage } from "@asurandi/types"

export const testWhatsappUseCase = async () => {
    const updateRequest: OutgoingWhatsappMessageRequest = {
        saasId: 'bullbrothers',
        phoneNumber: '5582334377',
        text: 'Hola desde asurandi'
    }
    const msg: MessageBusMessage<OutgoingWhatsappMessageRequest> = {
        exchange: 'ex.whatsapp',
        intents: 0,
        maxIntents: 5,
        payload: updateRequest,
        retry_ttl: 10_000,
        routingKey: 'whatsapp.outgoing',
        ttl: 600_000

    }

    await sendToMessageBus(msg)
    return
}