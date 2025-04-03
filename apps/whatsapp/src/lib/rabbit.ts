import amqp from 'amqplib';
import env from '@/env.js'
import type { MessageBusMessage } from '@asurandi/types';

export async function assertRabbitMQ() {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      let connection: amqp.ChannelModel
      let channel: amqp.Channel

      try {
        // Create a connection to the RabbitMQ server
        connection = await amqp.connect(env.RABBIT_CONNECTION_STRING);

        // Create a channel
        channel = await connection.createChannel();

        if (!connection || !channel) {
          throw new Error("No se pudo conectar a RabbitMQ");

        }

        // permanently failed messages
        {
          channel.assertExchange('ex.dlx.dropped', 'topic', { durable: true });
          channel.assertQueue('q.dlx.dropped', { durable: true });
          channel.bindQueue('q.dlx.dropped', 'ex.dlx.dropped', '#');
        }

        // whatsapp service
        {
          channel.assertExchange('ex.whatsapp', 'topic', { durable: true });
          channel.assertExchange('ex.whatsapp.retry', 'topic', { durable: true });

          // outging Q 
          channel.assertQueue('q.whatsapp.outgoing', {
            durable: true,
            arguments: {
              'x-message-ttl': 20 * 60_000, // 20 mins 
              'x-dead-letter-exchange': 'ex.dlx.dropped',
              'x-dead-letter-routing-key': 'deadletter'
            }
          });

          // outgoing retry Q
          channel.assertQueue('q.whatsapp.outgoing.retry', {
            durable: true,
            arguments: {
              'x-message-ttl': 10_000, // Reintentar 10s después
              'x-dead-letter-exchange': 'ex.whatsapp',
              'x-dead-letter-routing-key': 'whatsapp.outgoing'
            }
          });

          // binds exchanges & queues
          channel.bindQueue('q.whatsapp.outgoing', 'ex.whatsapp', 'whatsapp.outgoing.#')
          channel.bindQueue('q.whatsapp.outgoing.retry', 'ex.whatsapp.retry', '#')
        }

        console.info(`${new Date().toISOString()} - Rabbit MQ server is ready`);

        // Set up a clean shutdown
        process.on('SIGINT', () => cleanShutdown(connection, channel));
        process.on('SIGTERM', () => cleanShutdown(connection, channel));

        resolve(true)

      } catch (err) {
        console.error(`${new Date().toISOString()} - Error aserting RabbitMQ server...`);
        console.error(err);
        // Attempt to close connection if it was opened
        reject(err)


      }
    }, 2000)
  })

}

function cleanShutdown(connection: { close: () => Promise<any>; }, channel: { close: () => Promise<any>; }) {
  console.info(`${new Date().toISOString()} - Shutting down gracefully...`);
  if (channel) {
    channel.close()
      .then(() => console.info(`${new Date().toISOString()} - Channel closed`))
      .catch(console.error);
  }
  if (connection) {
    connection.close()
      .then(() => console.info(`${new Date().toISOString()} - Connection closed`))
      .catch(console.error)
      .finally(() => process.exit(0));
  } else {
    process.exit(0);
  }
}

export async function rabbitSendToMessageBus(message: MessageBusMessage<unknown>, channel: amqp.Channel): Promise<void> {
  try {

    // Publish the message
    channel.publish(message.exchange, message.routingKey, Buffer.from(JSON.stringify(message)), {
      expiration: message.ttl,
    });

  } catch (error) {
    console.error(`${new Date()} - Error enviando mensaje a RabbitMQ:`);
    console.error(error)
    throw error;
  }
}