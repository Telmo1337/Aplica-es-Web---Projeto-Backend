import { ApiError } from "../utils/errors.js";

export function errorHandler(err, req, res, next) {
    console.error("ERROR: ", err);

    //erros da API
    //API errors
    if (err instanceof ApiError) {
        return res.status(err.status).json({
            success: false,
            error: err.message,
        });
    }

    //erros de autenticação JWT
    //JWT authentication errors
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
        return res.status(401).json({
            success: false,
            error: "Invalid or expired token",
        });
    }


    //generic server error
    //erro genérico do servidor
    return res.status(500).json({
        success: false,
        error: err.message || "Internal server error",
    });
}