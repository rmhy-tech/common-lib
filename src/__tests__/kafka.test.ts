import { produceMessage, consumeMessages } from "../config/kafka";
import { Kafka } from "kafkajs";

jest.mock("kafkajs", () => ({
    Kafka: jest.fn().mockImplementation(() => ({
        producer: jest.fn().mockReturnValue({
            connect: jest.fn(),
            send: jest.fn(),
            disconnect: jest.fn(),
        }),
        consumer: jest.fn().mockReturnValue({
            connect: jest.fn(),
            subscribe: jest.fn(),
            run: jest.fn(),
            disconnect: jest.fn(),
        }),
    })),
}));

describe("Kafka Config", () => {
    it("should produce messages without errors", async () => {
        await expect(produceMessage("test-topic", { message: "test" })).resolves.not.toThrow();
    });

    it("should consume messages without errors", async () => {
        await expect(consumeMessages("test-topic", "test-group", jest.fn())).resolves.not.toThrow();
    });
});
