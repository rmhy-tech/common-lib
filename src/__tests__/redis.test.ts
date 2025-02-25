import { registerService } from "../config/redis";
import Redis from "ioredis";

jest.mock("ioredis");

describe("Redis Config", () => {
    it("should register services in Redis", async () => {
        await expect(registerService("test-service", "http://localhost")).resolves.not.toThrow();
    });
});
