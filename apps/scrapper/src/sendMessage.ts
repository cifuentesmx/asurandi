import amqp from 'amqplib';
import { MessageBusMessage } from '@asurandi/types';
import { RABBIT_CONECCTION_STRING } from './env.js';

let channel: amqp.Channel
let connection: amqp.ChannelModel
export async function sendToMessageBus(message: MessageBusMessage<unknown>): Promise<void> {
    try {

        if (!connection) connection = await amqp.connect(RABBIT_CONECCTION_STRING)
        if (!channel) channel = await connection.createChannel()
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