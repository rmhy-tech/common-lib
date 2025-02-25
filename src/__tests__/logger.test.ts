import { logger } from "../utils/logger";
import winston from "winston";

jest.mock("winston");

describe("Logger Utility", () => {
    it("should log messages without errors", () => {
        expect(() => logger.info("Test log")).not.toThrow();
    });

    it("should log errors without errors", () => {
        expect(() => logger.error("Test error")).not.toThrow();
    });
});
