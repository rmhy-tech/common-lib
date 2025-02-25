import "jest";
jest.mock("firebase-admin");
jest.mock("ioredis");
jest.mock("kafkajs");
jest.mock("winston", () => ({
    createLogger: jest.fn(() => ({
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
    })),
    transports: {
        Console: jest.fn(),
        File: jest.fn(),
    },
    format: {
        json: jest.fn(),
        combine: jest.fn(),
        timestamp: jest.fn(),
    },
}));

afterAll(async () => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
});
