export class BaseError extends Error {
    public statusCode: number;

    constructor(message: string, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
    }
}

export class AuthError extends BaseError {
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}

export class ValidationError extends BaseError {
    constructor(message = "Validation failed") {
        super(message, 400);
    }
}