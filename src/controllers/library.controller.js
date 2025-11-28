// Controller da biblioteca: trata request/response e chama a camada de serviços
import { z } from "zod";

import {
  getPublicLibraryService,
  getLibraryStatsService,
  getFavoritesService,
  getWatchedService,
  getUserLibraryService,
  updateLibraryEntryService,
  addToLibraryService,
  removeFromLibraryService
} from "../services/library.service.js";


import { updateLibrarySchema } from "../schemas/library.schema.js";
import { validateSchema } from "../utils/validation.js";


// Biblioteca pública de outro user
export async function getPublicLibrary(req, res, next) {
  try {
    const { nickName } = validateSchema(
      z.object({ nickName: z.string().min(1, "Nickname is required") }),
      req.params
    );
    const result = await getPublicLibraryService(nickName);
    res.json(result);
  } catch (err) { next(err); }
}


// Estatísticas da biblioteca
export async function getLibraryStats(req, res, next) {
  try {
    const result = await getLibraryStatsService(req.user.id);
    res.json(result);
  } catch (err) { next(err); }
}


// Favoritos
export async function getFavorites(req, res, next) {
  try {
    const result = await getFavoritesService(req.user.id);
    res.json(result);
  } catch (err) { next(err); }
}


// Vistos
export async function getWatched(req, res, next) {
  try {
    const result = await getWatchedService(req.user.id);
    res.json(result);
  } catch (err) { next(err); }
}


// Biblioteca completa
export async function getUserLibrary(req, res, next) {
  try {
    const result = await getUserLibraryService(req.user.id);
    res.json(result);
  } catch (err) { next(err); }
}


// Atualizar entrada
export async function updateLibraryEntry(req, res, next) {
  try {
    const { mediaId } = validateSchema(
      z.object({ mediaId: z.string().uuid("Invalid media id") }),
      req.params
    );
    const body = validateSchema(updateLibrarySchema, req.body);
    const result = await updateLibraryEntryService(
      req.user.id,
      mediaId,
      body
    );
    res.json(result);
  } catch (err) { next(err); }
}


// Adicionar media à biblioteca
export async function addToLibrary(req, res, next) {
  try {
    const { mediaId } = validateSchema(
      z.object({ mediaId: z.string().uuid("Invalid media id") }),
      req.params
    );
    const result = await addToLibraryService(req.user.id, mediaId);
    res.status(201).json(result);
  } catch (err) { next(err); }
}



// Remover media da biblioteca
export async function removeFromLibrary(req, res, next) {
  try {
    const { mediaId } = validateSchema(
      z.object({ mediaId: z.string().uuid("Invalid media id") }),
      req.params
    );
    const result = await removeFromLibraryService(req.user.id, mediaId);
    res.json(result);
  } catch (err) { next(err); }
}
