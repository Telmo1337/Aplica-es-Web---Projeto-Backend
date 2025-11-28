// Controller: recebe o pedido HTTP e chama os serviços

import {
  getCommentsByUserService,
  updateCommentService,
  deleteCommentService
} from "../services/comments.service.js";


import { z } from "zod";
import { updateCommentSchema } from "../schemas/comments.schema.js";
import { validateSchema } from "../utils/validation.js";


// ===============================
// LISTAR COMENTÁRIOS DE UM USER
// ===============================
export async function getCommentsByUser(req, res, next) {
  try {
  
    const { nickName } = validateSchema(
      z.object({ nickName: z.string().min(1, "Nickname is required") }),
      req.params
    );

    const result = await getCommentsByUserService(nickName);

    res.json(result);

  } catch (err) {
    next(err);
  }
}

// ===============================
// EDITAR COMENTÁRIO
// ===============================
export async function updateComment(req, res, next) {
  try {
    
    const { commentId } = validateSchema(
      z.object({ commentId: z.string().uuid("Invalid comment id") }),
      req.params
    );
    const body = validateSchema(updateCommentSchema, req.body);

  
    const result = await updateCommentService(commentId, body, req.user);

    res.json(result);

  } catch (err) {
    next(err);
  }
}

// ===============================
// APAGAR COMENTÁRIO
// ===============================
export async function deleteComment(req, res, next) {
  try {
   
    const { commentId } = validateSchema(
      z.object({ commentId: z.string().uuid("Invalid comment id") }),
      req.params
    );

    const result = await deleteCommentService(commentId, req.user);

    res.json(result);

  } catch (err) {
    next(err);
  }
}