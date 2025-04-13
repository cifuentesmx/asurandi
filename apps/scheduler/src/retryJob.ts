import { MessageBusMessage } from '@asurandi/types';
import { sendToMessageBus } from './sendMessage.js';

export async function retryJob(message: MessageBusMessage<MessageBusMessage<unknown>>)
    : Promise<void> {
    const original = message.payload
    await sendToMessageBus({ ...original, intents: original.intents++ })
}