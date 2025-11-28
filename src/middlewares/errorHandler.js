export function errorHandler(err, req, res, next) {
    console.error("ERROR: ", err);

    let status = 500;
    let message = "Internal server error";

    // Erros esperados (throw new Error)
    if (err.message) {
        message = err.message;

        if (message.includes("not found")) status = 404;
        if (message.includes("already") || message.includes("exists")) status = 409;
        if (message.includes("Invalid")) status = 400;
        if (message.includes("required")) status = 400;
        if (message.includes("Unauthorized")) status = 401;
    }

    return res.status(status).json({
        success: false,
        error: message
    });
}
