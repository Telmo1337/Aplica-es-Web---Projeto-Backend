export class ApiError extends Error {
    constructor(message, status = 500) {
        super(message);
        this.status = status;
    }
}

export function badRequest(message) {
    return new ApiError(message, 400);
}

export function unauthorized(message) {
    return new ApiError(message, 401);
}

export function forbidden(message) {
    return new ApiError(message, 403);
}

export function notFound(message) {
    return new ApiError(message, 404);
}

export function conflict(message) {
    return new ApiError(message, 409);
}