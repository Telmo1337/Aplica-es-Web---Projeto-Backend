//importar express router
//import express router
import {Router} from "express";

//importar prisma client
//import prisma client
import { prisma } from "../db/prisma.js";

//importar  funções de autenticação
//import authentication functions
import { verifyToken, requireAdmin } from "../utils/auth.js";


//criar router
//create router
const userRouter = Router();

//rota apenas para role ADMIN - ver todos os users
//route only for ADMIN role - view all users
userRouter.get("/", verifyToken, requireAdmin, async(req,res, next)=>{
    try {
        //retornar apenas os campos seguros
        //return only safe fields
        const users = await prisma.user.findMany({
            select: {id: true, firstName: true, lastName: true, nickName: true, email: true, createdAt: true},
        })

        //enviar resposta
        //send response
        res.status(200).json(users)

    }catch(err){
        //erro ao obter lista de users
        //error getting user list
        next()
    }
});


//ver medias criados de um user pelo nickName
//view media created by a user by nickName
userRouter.get("/:nickName/media", verifyToken, async (req, res, next) => {
  try {
    const { nickName } = req.params;

    //encontrar o user pelo nickName
    //find the user by nickName
    const user = await prisma.user.findUnique({
      where: { nickName },
      select: { id: true, nickName: true }
    });

    //se o user não existir
    //if the user does not exist
    if (!user) {
      return res.status(404).json({ err: "User not found" });
    }

    //encontrar media criados por esse user
    //find media created by that user
    const mediaList = await prisma.media.findMany({
      where: { userId: user.id },
      include: {
        user: { select: { id: true, nickName: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    //retornar a lista de media
    //return the media list
    res.json(mediaList);

  } catch (err) {
    //erro ao obter medias do user
    //error getting user's media
    next(err);
  }
});




export default userRouter;