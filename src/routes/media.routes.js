//Rotas responsáveis pela gestão de filmes e séries (media)

import { Router } from "express";
import { verifyToken, requireAdmin } from "../utils/auth.js";

//importar funções do controller
//import media controller functions
import {
  getTopMovies,
  getTopSeries,
  getGlobalRanking,
  getMediaByCategory,
  createComment,
  listComments,
  createMedia,
  listAllMedia,
  searchMediaByTitle,
  getMediaById,
  updateMedia,
  deleteMedia
} from "../controllers/media.controller.js";

const router = Router();


//Top 10 filmes
router.get("/top/global/movies", verifyToken, getTopMovies);

//Top 10 séries
router.get("/top/global/series", verifyToken, getTopSeries);

//ranking geral
//global ranking
router.get("/ranking", verifyToken, getGlobalRanking);
  
//Filtrar por categoria
//filter by category
router.get("/bycategory", verifyToken, getMediaByCategory);

//criar comentário para um media
//create comment for a media
router.post("/:mediaId/comments", verifyToken, createComment);

//ver comentários de um media
//view comments of a media
router.get("/:mediaId/comments", listComments);

//criar media (apenas admin)
//create media (only admin)
router.post("/", verifyToken, requireAdmin, createMedia);

//obter todos media com paginação e ordenação
//get all media with pagination and sorting
router.get("/", verifyToken, listAllMedia);

//pesquisar por título
//search by title
router.get("/search", verifyToken, searchMediaByTitle);

//obter media por ID
//get media by ID
router.get("/:id", verifyToken, getMediaById);

//atualizar dados do media - apenas o admin
//update media - only admin
router.put("/:id", verifyToken, requireAdmin, updateMedia);

//apagar media - apenas o admin
//delete media - only admin
router.delete("/:id", verifyToken, requireAdmin, deleteMedia);


export default router;
