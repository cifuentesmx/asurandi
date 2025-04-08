import amqp from 'amqplib';
import { assertRabbitMQ, rabbitSendToMessageBus } from '@/lib/rabbit.js';
import env from '@/env.js';
import type { SaasAccount, MessageBusMessage, OutgoingWhatsappMessageRequest } from '@asurandi/types';
import { accountsSubscribe } from '@/lib/accountsSubscribe.js';
import { restartConnection } from './restartConnection.js';
import { WAConnection } from './WAConnectionClass.ts';
let count = 0
export class ConnectionCluster {
    unsubs?: () => void
    bots: Map<string, WAConnection>
    activeStatus = ['trialing', 'active']
    amqpConnection?: amqp.ChannelModel
    amqpChannel?: amqp.Channel
    constructor() {
        this.bots = new Map()
        this.init()
    }
    async init() {

        try {
            await assertRabbitMQ()
            this.amqpConnection = await amqp.connect(env.RABBIT_CONNECTION_STRING);
            this.amqpChannel = await this.amqpConnection.createChannel();
            this.amqpChannel.prefetch(1);

            console.info(`${new Date().toISOString()} - Esperando mensajes en la cola: 'q.whatsapp.outgoing'`);
            this.amqpChannel.consume('q.whatsapp.outgoing', async (msg) => {
                if (msg) {
                    const str = msg.content.toString()
                    const message = await JSON.parse(str) as MessageBusMessage<OutgoingWhatsappMessageRequest>
                    await this.processOutgoing(message)
                    this.amqpChannel?.ack(msg);
                    return
                }
                // Acknowledge the message as successfully processed

            });
        } catch (error) {
            console.error(`${new Date().toISOString()} - Error al establecer el procesador de mensajes:`);
            console.error(error)
        }
        this.unsubs = accountsSubscribe((account: SaasAccount, change: FirebaseFirestore.DocumentChangeType) => {
            const bot = this.bots.get(account.id)
            bot?.stop()
            this.bots.delete(account.id)
            if (change === 'removed') {
                console.info(`⛔ ${new Date().toISOString()} - Se ha eliminado/desactivado la conexión para la cuenta '${account.name}'`)
            }
            else {
                if (this.activeStatus.includes(account.status)) {
                    count++
                    console.info(`🚀 ${new Date().toISOString()} - Se ha activado conexión la cuenta '${account.name}'`)
                    this.bots.set(account.id, new WAConnection(account, count))
                } else {
                    console.info(`⛔ ${new Date().toISOString()} - El Status de la cuenta no está activa para la conexión de la cuenta '${account.name}'`)
                }
            }
        })
    }
    async restartConnection(accountId: string) {
        setTimeout(async () => {
            await restartConnection(accountId)
        }, 3500);

    }
    async processOutgoing(msg: MessageBusMessage<OutgoingWhatsappMessageRequest>) {
        if (!this.amqpChannel) throw new Error('No está lista la conexión con el servidor de mensajes RabbitMq')

        msg.intents++
        if (msg.intents > msg.maxIntents) {
            console.error('El mensaje ha fallado permanentemente.')
            return await rabbitSendToMessageBus({ ...msg, exchange: 'ex.jobs', routingKey: 'failed.whatsapp.outgoing' }, this.amqpChannel)
        }
        try {
            return await this.bots.get(msg.payload.saasId)?.outgoingMessage(msg.payload)
        } catch (error) {
            console.error(error instanceof Error ? `${msg.intents} - ${error.message}` : 'nada')
            rabbitSendToMessageBus({
                ...msg,
                exchange: 'ex.jobs',
                routingKey: 'waiting.whatsapp.outgoing',
            },
                this.amqpChannel
            )
        }

        // const newOutgoingMessage = await JSON.parse(msg.content.toString()) as ChatwootOutgoingTask
        // try {

        //     const wMsg: InterprocessWorkerMessage = {
        //         type: 'new-outgoing-message',
        //         newOutgoingMessage
        //     }
        //     await this.bots[newOutgoingMessage.vikoAccount.id]?.bot?.postMessage(wMsg)
        //     this.amqpChannel?.ack(msg)
        //     return
        // }
        // catch (error) {
        //     // Reintenta los mensajes fallidos.
        //     if (newOutgoingMessage.intents <= MAX_INTENTS) {

        //         newOutgoingMessage.intents++
        //         await sendToRabbitMQ(
        //             JSON.stringify(newOutgoingMessage),
        //             'ex.whatsapp.retry',
        //             'whatsapp.outgoing.retry'
        //         ).catch(e => {
        //             console.error(`${new Date().toISOString()} - El reenvio del mensaje ha fallado inesperadamente.  ${msg.fields.routingKey}#${msg.fields.deliveryTag}`)
        //             console.error(e)
        //             this.amqpChannel?.nack(msg, false, false);
        //             return
        //         })

        //         this.amqpChannel?.ack(msg)
        //         console.error(`${new Date().toISOString()} - Error al procesar el mensaje, se va a reintentar más tarde. Intentos: ${newOutgoingMessage.intents}.  ${msg.fields.routingKey}#${msg.fields.deliveryTag}`);
        //         return
        //     }


        //     // El mensaje ha fallado permanentemente.
        //     this.amqpChannel?.nack(msg, false, false);
        //     console.error(`${new Date().toISOString()} - El mensaje  ${msg.fields.routingKey}#${msg.fields.deliveryTag} ha fallado permanentemente debido al siguiente error:`)
        //     console.error(error)
        // }
    }
    async destroy() {
        if (typeof this.unsubs === 'function') this.unsubs()
        for (const id in this.bots) {
            if (Object.prototype.hasOwnProperty.call(this.bots, id)) {
                const bot = this.bots[id].bot;
                await bot?.stop()
                delete this.bots[id]
            }
        }
        await this.amqpChannel?.close()
        if (typeof this.amqpConnection?.close === 'function') await this.amqpConnection?.close()
        setTimeout(() => {
            return
        }, 1500);
    }
}
