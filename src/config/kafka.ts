import { Kafka, Producer, Consumer } from "kafkajs";
import { logger } from "../utils/logger";

const kafka = new Kafka({
    clientId: "mereb-app",
    brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});

let producer: Producer | null = null;
let consumer: Consumer | null = null;

/**
 * Initialize Kafka Producer
 */
export const getKafkaProducer = async () => {
    if (!producer) {
        producer = kafka.producer();
        await producer.connect();
        logger.info("Kafka producer connected");
    }
    return producer;
};

/**
 * Send a message to a Kafka topic
 */
export const produceMessage = async (topic: string, message: any) => {
    const producer = await getKafkaProducer();
    await producer.send({
        topic,
        messages: [{ value: JSON.stringify(message) }],
    });
    logger.info(`Message sent to ${topic}: ${JSON.stringify(message)}`);
};

/**
 * Initialize Kafka Consumer
 */
export const getKafkaConsumer = async (groupId: string) => {
    if (!consumer) {
        consumer = kafka.consumer({ groupId });
        await consumer.connect();
        logger.info(`Kafka consumer connected to group ${groupId}`);
    }
    return consumer;
};

/**
 * Subscribe to a Kafka topic
 */
export const consumeMessages = async (topic: string, groupId: string, callback: (message: any) => void) => {
    const consumer = await getKafkaConsumer(groupId);
    await consumer.subscribe({ topic, fromBeginning: false });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const value = message.value?.toString();
            logger.info(`Received message from ${topic} [${partition}]: ${value}`);
            if (value) {
                callback(JSON.parse(value));
            }
        },
    });

    process.on("SIGTERM", async () => {
        if (consumer) {
            await consumer.disconnect();
            logger.info("Kafka consumer disconnected on SIGTERM");
        }
    });
};
