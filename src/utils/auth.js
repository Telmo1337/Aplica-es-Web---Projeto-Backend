//importar bibliotecas
//import libraries
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { forbidden, unauthorized } from "./errors.js";

//funções de segurança e autenticação
//security and authentication functions

//função para encriptar passwords antes de guardar na base de dados
//function to hash passwords before storing them in the database
export async function hashPassword(password) {

    return await bcrypt.hash(password, 12) //string, salt rounds
}


//verificar se a password inserida coincide com o hash guardado
//verifies if the password matches with the hashed password stored
export async function checkPassword(password, hashedPassword) {

    return await bcrypt.compare(password, hashedPassword)
}

//cria um JWT com informação essencial do utilizador
//creates a JWT with essential user information
export function generateToken(payload) {

    //payload: object com dados a codificar no token
    //payload: object with data to encode in the token
    return jwt.sign(
        { id: payload.id, email: payload.email, role: payload.role, nickName: payload.nickName }, //dados codificados
        process.env.JWT_SECRET, // secret key do .env // secret key from .env
        { expiresIn: "7d" } //tempo de validade do token // token validity time
    )


}



//verifica se o pedido contém um JWT válido
//checks if the request contains a valid JWT
export const verifyToken = (req, res, next) => {

    //obter token do header
    //get token from header
    const authHeader = req.headers.authorization;

    //se não existir token
    //if no token exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ err: "No token provided" });
    }

    //extrair token
    //extract token
    const token = authHeader.split(" ")[1];

    //verificar token
    //verify token
    try {
        //decodificar token
        //decode token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //adicionar dados do user ao request
        //add user data to request
        req.user = decoded;
        //chamar próximo middleware
        //call next middleware
        next();
    } catch (err) {
        //token inválido
        //invalid token
        return res.status(403).json({ err: "Invalid token" });
    }
}


//permite acesso apenas a utilizadores com role ADMIN
//allows access only to users with ADMIN role
export function requireAdmin(req, res, next) {
    //verificar se o user é admin
    //check if the user is admin
    if (req.user.role !== "ADMIN") {
        return res.status(403).json({ err: "Access denied. Admins only." });
    }
    next();
}
