//ficheiro que representa as rotas de autenticação (registo e login)
//file that represents authentication routes (register and login)

//importar dependencias
//import dependencies


import { Router } from "express";
import { prisma } from "../db/prisma.js";

//importar funções de autenticação
//import authentication functions
import { hashPassword, checkPassword, generateToken } from "../utils/auth.js";

//importar zod para validação
//import zod for validation
import { z } from "zod";


//criar router
//create router
const authRouter = Router();


//validar os dados para o registo
//validate data for registration
const registerSchema = z.object({
    email: z.string().email("Invalid email"),
    firstName: z.string().min(2, "Short name"),
    lastName: z.string().min(2, "Short last name"),
    nickName: z.string()
        .trim()
        .min(2, "Short nickname")
        .regex(/^\S+$/, "Nickname cannot contain spaces"),
    password: z.string().min(6, "Your password must have at least 6 caracters"),

});


//validação dos dados para o login
//validate data for login
const loginSchema = z.object({
    identifier: z.string().min(1, "Email or nickname is required"),
    password: z.string().min(1, "Password is required"),
});



//rota registar
//register route
authRouter.post("/register", async (req, res, next) => {
    try {
        //validar dados com o zod
        //validate data with zod
        const result = registerSchema.safeParse(req.body);

        //se não for válido
        //if not valid
        if (!result.success) {
            return res.status(400).json({ errors: result.error.flatten().fieldErrors })
        }


        //extrair dados validados
        //extract validated data
        const { email, firstName, lastName, nickName, password } = result.data;
        
        //verificar se o user já existe (email ou nickName)
        //check if the user already exists (email or nickName)
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { nickName }
                ]
            }
        });

        //se já existir, retornar erro
        //if already exists, return error
        if (existingUser) {
            return res.status(400).json({
                err: existingUser.email === email
                    ? "Email already in use"
                    : "Nickname already in use"
            });
        }


        //verificar se é o primeiro user - atribuir role ADMIN
        //check if it is the first user - assign ADMIN role
        const userCount = await prisma.user.count();
        const role = userCount === 0 ? "ADMIN" : "MEMBER";


        //encriptar password HASH PASSWORD
        //encrypt password
        const hashedPassword = await hashPassword(password);

        //criar user (sempre role MEMBER por defeito)
        //create user (always role MEMBER by default)
        const user = await prisma.user.create({
            data: { email, firstName, lastName, nickName, password: hashedPassword, role },
        });

        //criar token jwt
        //create jwt token
        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role,
            nickName: user.nickName
        });


        //remover o campo password da res
        //hide password field from response
        const { password: _, ...userWithoutPassword } = user;

        
        //enviar resposta
        //send response
        res.status(201).json({
            user: {
                id: userWithoutPassword.id,
                email: userWithoutPassword.email,
                firstName: userWithoutPassword.firstName,
                lastName: userWithoutPassword.lastName,
                nickName: userWithoutPassword.nickName,
                createdAt: userWithoutPassword.createdAt,
                role: userWithoutPassword.role
            }, token
        });

    } catch (err) {
        //erro no registo
        //registration error
        next(err);
    }
})



//rota login
//login route
authRouter.post('/login', async (req, res, next) => {
    try {

        //validar dados zod
        //validate data with zod
        const result = loginSchema.safeParse(req.body)

        //se não for válido
        //if not valid
        if (!result.success) {
            return res.status(400).json({ errors: result.error.flatten().fieldErrors })
        }

        //extrair dados validados
        //extract validated data
        const { identifier, password } = result.data;

        //verificar se o user já existe
        //check if the user already exists
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { nickName: identifier }
                ]
            },
            select: { id: true, email: true, firstName: true, lastName: true, nickName: true, password: true, createdAt: true, role: true }
        });
        //se não existir
        //if does not exist
        if (!user) {
            return res.status(404).json({ err: "User not found" })
        }

        //validar password
        //validate password
        const valid = await checkPassword(password, user.password);
        if (!valid) {
            return res.status(401).json({ err: "Incorrect Password" })
        }


        //criar token jwt
        //create jwt token
        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role,
            nickName: user.nickName
        });


        //hide password
        //hide password field from response
        const { password: _, ...userWithoutPassword } = user;

        //enviar resposta
        //send response
        res.status(200).json({ user: userWithoutPassword, token })

    } catch (err) {
        //erro no login
        //login error
        next(err)
    }
})


export default authRouter;