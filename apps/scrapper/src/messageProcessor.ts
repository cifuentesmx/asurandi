import amqp from 'amqplib';
import { updatePoliza } from './events/updatePoliza.js';
import { MessageBusMessage, UpdateRequestPoliza, UpdateRequestPolizasInRange } from '@asurandi/types';
import { RABBIT_CONECCTION_STRING } from './env.js';
import { dailyScrapper } from './events/dailyScrapper.js';
export async function startConsumer(): Promise<void> {
    try {
        const connection = await amqp.connect(RABBIT_CONECCTION_STRING, { timeout: 10_000 });
        const channel = await connection.createChannel();

        if (!connection || !channel) {
            throw new Error("No se pudo conectar a RabbitMQ");

        }
        // Scrapper service 
        await channel.assertExchange('ex.scrapper', 'topic', { durable: true });
        await channel.assertQueue('q.scrapper', {
            durable: true,
            arguments: {
                'x-consumer-timeout': 14_400_000,
                'x-message-ttl': 14_400_000, // Falla después de 4 horas
                'x-dead-letter-exchange': 'ex.jobs',
                'x-dead-letter-routing-key': 'failed.scrapper',
            }
        });
        await channel.bindQueue('q.scrapper', 'ex.scrapper', '#')

        console.info(`${new Date()} - Rabbit MQ server is ready`);

        channel.prefetch(2);
        // Consume messages for service
        channel.consume('q.scrapper', async (msg) => {
            try {
                if (msg) {

                    const str = msg?.content?.toString()
                    const theMessage: MessageBusMessage<UpdateRequestPoliza | UpdateRequestPolizasInRange> =
                        await JSON.parse(str) as MessageBusMessage<UpdateRequestPoliza | UpdateRequestPolizasInRange>

                    try {

                        // Process message
                        if (theMessage.payload.saasId && theMessage.routingKey.startsWith('poliza')) {
                            await updatePoliza(theMessage as MessageBusMessage<UpdateRequestPoliza>)
                            channel.ack(msg);
                            return

                        }
                        if (theMessage.payload.saasId && theMessage.routingKey.startsWith('daily')) {
                            await dailyScrapper(theMessage as MessageBusMessage<UpdateRequestPolizasInRange>)
                            channel.ack(msg);
                            return
                        }


                        // Mesaje no identificado
                        throw new Error('No se identifico el tipo de mensaje y no se pudo procesar.')

                    } catch (error) {
                        channel.nack(msg, false, false);
                        console.error(`${new Date()} - El mensaje  ${msg.fields.routingKey}#${msg.fields.deliveryTag} ha fallado permanentemente debido al siguiente error:`)
                        console.error(error)
                    }
                }
            } catch (error) {
                console.error(`${new Date()} El mensaje ha fallado de forma inesperada. ¿Está enviado por una de nuestras apps?`);
                console.error(error)
            }
        })
        console.info(`${new Date()} - Conectado correctamente al broker de mensajes`);
    } catch (error) {
        console.error(`${new Date()} - Error al establecer el procesador de mensajes`);
        console.error(error)
    }
}

