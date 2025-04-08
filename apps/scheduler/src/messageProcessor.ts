import amqp from 'amqplib';
import { retryJob } from 'retryJob.js';
import { MessageBusMessage } from '@asurandi/types';
import env from 'env.js';

export async function startConsumer(): Promise<void> {
    try {
        const connection = await amqp.connect(env.RABBIT_CONECCTION_STRING, { timeout: 10_000 });
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
                'x-message-ttl': 14_400_000, // Falla despues de 4 horas sin que sea reintentado
                'x-dead-letter-exchange': 'ex.jobs',
                'x-dead-letter-routing-key': 'failed'
            }
        });
        await channel.assertQueue('q.jobs.failed', { durable: true });

        await channel.bindQueue('q.jobs.waiting', 'ex.jobs', 'waiting.#')
        await channel.bindQueue('q.jobs.retry', 'ex.jobs', 'retry.#')
        await channel.bindQueue('q.jobs.failed', 'ex.jobs', 'failed.#')

        console.info(`${new Date()} - Rabbit MQ server is ready`);

        channel.prefetch(1);
        // // Consume messages for service
        channel.consume('q.jobs.retry', async (msg) => {
            if (msg) {
                console.info(`Se va a reintentar el mensaje: ${msg?.fields.routingKey}:${msg?.fields.deliveryTag}`)

                const str = msg?.content?.toString()
                const message: MessageBusMessage<MessageBusMessage<unknown>> =
                    await JSON.parse(str) as MessageBusMessage<MessageBusMessage<unknown>>

                try {
                    channel.ack(msg)
                    retryJob(message)
                } catch (error) {
                    console.error(`${new Date()} - El mensaje ha fallado de forma inesperada. ¿Está enviado por una de nuestras apps?`);
                    console.error(error)
                }
            }
        })
        console.info(`${new Date()} - Conectado correctamente al broker de mensajes`);
    } catch (error) {
        console.error(`${new Date()} - Error al establecer el procesador de mensajes`);
        console.error(error)
    }
}

