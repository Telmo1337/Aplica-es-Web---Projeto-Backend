// Controller das listas: recebe pedido HTTP e delega para os serviços

import {
  createListService,
  getMyListsService,
  getListByIdService,
  deleteListService,
  changeListPrivacyService,
  addMediaToListService,
  removeMediaFromListService
} from "../services/list.service.js";


import { z } from "zod";
import { listCreateSchema, listPrivacySchema } from "../schemas/list.schema.js";
import { validateSchema } from "../utils/validation.js";




// Criar lista
export async function createList(req, res, next) {
  try {
  
    const body = validateSchema(listCreateSchema, req.body);
    const result = await createListService(req.user.id, body);
    res.status(201).json(result);
  } catch (err) { next(err); }
}


// Listas do utilizador autenticado
export async function getMyLists(req, res, next) {
  try {
    const result = await getMyListsService(req.user.id);
    res.json(result);
  } catch (err) { next(err); }
}


// Ver lista por ID respeitando privacidade
export async function getListById(req, res, next) {
  try {
    
    const { listId } = validateSchema(
      z.object({ listId: z.string().uuid("Invalid list id") }),
      req.params
    );
    const result = await getListByIdService(listId, req.user.id);
    res.json(result);
  } catch (err) { next(err); }
}


// Apagar lista
export async function deleteList(req, res, next) {
  try {
   
    const { listId } = validateSchema(
      z.object({ listId: z.string().uuid("Invalid list id") }),
      req.params
    );
    const result = await deleteListService(listId, req.user.id);
    res.json(result);
  } catch (err) { next(err); }
}

// Alterar privacidade da lista
export async function changeListPrivacy(req, res, next) {
  try {
  
    const { listId } = validateSchema(
      z.object({ listId: z.string().uuid("Invalid list id") }),
      req.params
    );
    const body = validateSchema(listPrivacySchema, req.body);
    const result = await changeListPrivacyService(listId, req.user.id, body);
    res.json(result);
  } catch (err) { next(err); }
}


// Adicionar media à lista
export async function addMediaToList(req, res, next) {
  try {
    const { listId, mediaId } = validateSchema(
      z.object({
        listId: z.string().uuid("Invalid list id"),
        mediaId: z.string().uuid("Invalid media id")
      }),
      req.params
    );
    const result = await addMediaToListService(listId, mediaId, req.user.id);
    res.status(201).json(result);
  } catch (err) { next(err); }
}


// Remover media da lista
export async function removeMediaFromList(req, res, next) {
  try {
  
    const { listId, mediaId } = validateSchema(
      z.object({
        listId: z.string().uuid("Invalid list id"),
        mediaId: z.string().uuid("Invalid media id")
      }),
      req.params
    );
    const result = await removeMediaFromListService(listId, mediaId, req.user.id);
    res.json(result);
  } catch (err) { next(err); }
}
