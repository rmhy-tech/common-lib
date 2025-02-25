import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import {AuthError} from "../errors/BaseError";
import {logger} from "../utils/logger";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        logger.warn("Unauthorized access attempt (No token)");
        return next(new AuthError("No token provided"));
    }

    try {
        (req as any).user = jwt.verify(token, JWT_SECRET);
        next();
    } catch (error) {
        logger.warn("Unauthorized access attempt (Invalid token)");
        return next(new AuthError("Invalid token"));
    }
};
