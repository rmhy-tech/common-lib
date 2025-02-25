import { Request, Response, NextFunction } from "express";
import { BaseError } from "./BaseError";

export const errorHandler = (err: BaseError, req: Request, res: Response, next: NextFunction) => {
    res.status(err.statusCode || 500).json({ message: err.message });
};
