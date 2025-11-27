// routes/comments.routes.js
//file that represents comment routes

//importar dependencias
//import dependencies
import { Router } from "express";
import { prisma } from "../db/prisma.js";

//importar função de autenticação
//import authentication function
import { verifyToken } from "../utils/auth.js";

//criar router
//create router
const commentRouter = Router();


//verificar todos os comentários de um determinado utilizador (pelo nickName)
//view all comments of a specific user (by nickName)
commentRouter.get("/user/:nickName", async (req, res, next) => {
  try {

    //obter comentários do user
    //get user's comments
    const comments = await prisma.comment.findMany({
      where: {
        user: { nickName: req.params.nickName }
      },
      include: {
        media: { select: { id: true, title: true } },
        user: { select: { id: true, nickName: true } }
      }
    });

    //retornar comentários
    //return comments
    res.json(comments);

  } catch (err) {
    //erro ao obter comentários
    //error getting comments
    next(err);
  }
});


//editar comentario
//edit comment
commentRouter.put("/:commentId", verifyToken, async (req, res, next) => {
  try {

    //obter novo conteúdo
    //get new content
    const { content } = req.body;

    //validar conteúdo
    //validate content
    if (!content || content.trim() === "") {
      return res.status(400).json({ err: "Content is required" });
    }

    //verificar se o comentário existe e pertence ao user
    //check if comment exists and belongs to user
    const comment = await prisma.comment.findUnique({
      where: { id: req.params.commentId }
    });

    //se o comentário não existir
    //if comment does not exist
    if (!comment) {
      return res.status(404).json({ err: "Comment not found" });
    }
    //verificar se o comentário pertence ao user autenticado
    //check if comment belongs to authenticated user
    if (comment.userId !== req.user.id) {
      return res.status(403).json({ err: "Not allowed to edit this comment" });
    }

    //atualizar comentário
    //update comment
    const updated = await prisma.comment.update({
      where: { id: req.params.commentId },
      data: { content }
    });

    //retornar comentário atualizado
    //return updated comment
    res.json(updated);
  } catch (err) {
    //erro ao atualizar comentário
    //error updating comment
    next(err);
  }
});

// apagar comentario
// delete comment
commentRouter.delete("/:commentId", verifyToken, async (req, res, next) => {
  try {
    //verificar se o comentário existe
    //check if comment exists
    const comment = await prisma.comment.findUnique({
      where: { id: req.params.commentId }
    });

    //se o comentário não existir
    //if comment does not exist
    if (!comment) {
      return res.status(404).json({ err: "Comment not found" });
    }

    // pode apagar se for o criador OU admin
    // can delete if creator OR admin
    if (comment.userId !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({ err: "Not allowed to delete this comment" });
    }

    //apagar comentário
    //delete comment
    await prisma.comment.delete({
      where: { id: req.params.commentId }
    });

    //retornar sucesso
    //return success
    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    //erro ao apagar comentário
    //error deleting comment
    next(err);
  }
});

export default commentRouter;
