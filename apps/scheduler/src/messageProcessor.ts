import amqp from 'amqplib';
import { RABBIT_CONECCTION_STRING } from './env.js';

export async function startConsumer(): Promise<void> {
    try {
        const connection = await amqp.connect(RABBIT_CONECCTION_STRING, { timeout: 10_000 });
        const channel = await connection.createChannel();

        if (!connection || !channel) {
            throw new Error("No se pudo conectar a RabbitMQ");
        }

        // cola de espera para reintentos
        await channel.assertExchange('ex.jobs', 'topic', { durable: true });

        await channel.assertQueue('q.jobs.waiting', {
            durable: true,
            arguments: {
                'x-dead-letter-exchange': 'ex.jobs',
                'x-dead-letter-routing-key': 'retry'
            }
        });
        await channel.assertQueue('q.jobs.retry', {
            durable: true,
            arguments: {
                'x-message-ttl': 600_000, // Falla despues de 10 minutos sin que sea reintentado
                'x-dead-letter-exchange': 'ex.jobs',
                'x-dead-letter-routing-key': 'failed'
            }
        });
        await channel.assertQueue('q.jobs.failed', { durable: true });

        await channel.bindQueue('q.jobs.waiting', 'ex.jobs', 'waiting.#')
        await channel.bindQueue('q.jobs.retry', 'ex.jobs', 'retry.#')
        await channel.bindQueue('q.jobs.failed', 'ex.jobs', 'failed.#')

        console.info(`${new Date()} - Rabbit MQ server is ready`);

        // channel.prefetch(1);
        // // Consume messages for service
        // channel.consume('q.scrapper', async (msg) => {
        //     try {
        //         if (msg) {
        //             console.info(`Se ha recibido una solicitud: ${msg.fields.routingKey}:${msg.fields.deliveryTag}`)

        //             const str = msg?.content?.toString()
        //             const theMessage: MessageBusMessage<PolizaSiniestroUpdateRequest | PolizaSiniestroUpdateRequestRange> = await JSON.parse(str) as MessageBusMessage<PolizaSiniestroUpdateRequest | PolizaSiniestroUpdateRequestRange>
        //             try {

        //                 // Process message
        //                 if (theMessage.payload.saasId && theMessage.payload.company === 'qualitas' && theMessage.routingKey.startsWith('poliza')) {
        //                     const message = theMessage as MessageBusMessage<PolizaSiniestroUpdateRequest>
        //                     await updatePoliza(message)
        //                 }
        //                 if (theMessage.payload.saasId && theMessage.payload.company === 'qualitas' && theMessage.routingKey.startsWith('daily')) {
        //                     await dailyScrapper(theMessage as MessageBusMessage<PolizaSiniestroUpdateRequestRange>)
        //                 }
        //                 // Acknowledge the message as successfully processed
        //                 channel.ack(msg);
        //                 return



        //             } catch (error) {
        //                 if (theMessage.intents < 1) {
        //                     console.info(`${new Date()} - Mensaje fallido se va a reintentar`)
        //                     console.error(error)
        //                     theMessage.intents++
        //                     return await sendToMessageBus(theMessage)
        //                 }
        //                 console.info(`${new Date()} - El mensjae ha fallado permanentemente`)
        //                 console.error(error)

        //                 channel.nack(msg, false, false);
        //                 console.error(`${new Date()} - El mensaje  ${msg.fields.routingKey}#${msg.fields.deliveryTag} ha fallado permanentemente debido al siguiente error:`)
        //                 console.error(error)
        //             }
        //         }
        //     } catch (error) {
        //         console.error(`${new Date()} - El mensaje ha fallado de forma inesperada. ¿Está enviado por una de nuestras apps?`);
        //         console.error(error)
        //     }
        // })
        console.info(`${new Date()} - Conectado correctamente al broker de mensajes`);
    } catch (error) {
        console.error(`${new Date()} - Error al establecer el procesador de mensajes`);
        console.error(error)
    }
}

