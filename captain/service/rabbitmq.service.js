import ampq from "amqplib";
import dotenv from "dotenv";

dotenv.config();

const RABBITMQ_URI = process.env.RABBITMQ_URI;

let channel, connection;

export async function connect() {
  try {
    connection = await ampq.connect(RABBITMQ_URI);
    channel = await connection.createChannel();
    console.log("Connected to RabbitMQ");
  } catch (error) {
    console.error("Failed to connect to RabbitMQ", error);
  }
}

export async function subscribe(queue, callback) {
  if (!channel) await connect();
  await channel.assertQueue(queue);
  channel.consume(queue, (msg) => {
    callback(msg.content.toString());
    channel.ack(msg);
  });
}

export async function publish(queue, message) {
  if (!channel) await connect();
  await channel.assertQueue(queue);
  channel.sendToQueue(queue, Buffer.from(message));
}
