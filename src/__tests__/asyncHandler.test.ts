import { asyncHandler } from "../middleware/asyncHandler";
import { Request, Response, NextFunction } from "express";

describe("Async Handler Middleware", () => {
    it("should call next() on success", async () => {
        const mockFn = jest.fn().mockImplementation(async (req, res, next) => {
            next(); // Ensure next() is called inside async function
        });

        const req = {} as Request;
        const res = {} as Response;
        const next = jest.fn();

        await asyncHandler(mockFn)(req, res, next);

        // Ensure next() was called
        expect(next).toHaveBeenCalled();
    });

    it("should catch errors and call next() with error", async () => {
        const mockFn = jest.fn().mockRejectedValue(new Error("Test Error"));
        const req = {} as Request;
        const res = {} as Response;
        const next = jest.fn();

        await asyncHandler(mockFn)(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error)); // Verify next() received an error
    });
});
