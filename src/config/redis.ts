import Redis from "ioredis";
import { logger } from "../utils/logger";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

export const registerService = async (serviceName: string, serviceUrl: string) => {
    await redis.set(`service:${serviceName}`, serviceUrl, "EX", 60);
    logger.info(`✅ Registered ${serviceName}: REST(${serviceUrl})`);
};
