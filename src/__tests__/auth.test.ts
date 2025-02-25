import { authenticate } from "../middleware/auth";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthError } from "../errors/BaseError";

jest.mock("jsonwebtoken", () => ({
    verify: jest.fn(),
}));

describe("Authentication Middleware", () => {
    const req = { headers: { authorization: "Bearer test-token" } } as Request;
    const res = {} as Response;
    const next = jest.fn();

    it("should authenticate valid JWT", () => {
        (jwt.verify as jest.Mock).mockReturnValue({ userId: "123" });
        authenticate(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it("should call next() with AuthError if no token is provided", () => {
        const invalidReq = { headers: {} } as Request;
        const nextWithError = jest.fn();

        authenticate(invalidReq, res, nextWithError);

        expect(nextWithError).toHaveBeenCalledWith(expect.any(AuthError));
    });
});
