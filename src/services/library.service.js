// Lógica da biblioteca (userMedia)
// Aqui ficam todas as interações com o Prisma e regras da biblioteca

import { prisma } from "../db/prisma.js";
import { updateLibrarySchema } from "../schemas/library.schema.js";


// ====================================================================
// BIBLIOTECA PÚBLICA DE OUTRO USER
// ====================================================================
export async function getPublicLibraryService(nickName) {

  const user = await prisma.user.findUnique({
    where: { nickName },
    select: { id: true, nickName: true }
  });

  if (!user) throw new Error("User not found");

  const library = await prisma.userMedia.findMany({
    where: { userId: user.id },
    select: {
      watched: true,
      rating: true,
      favorite: true,
      media: {
        select: {
          id: true,
          title: true,
          image: true,
          type: true,
          description: true
        }
      }
    }
  });

  return {
    user: user.nickName,
    count: library.length,
    library
  };
}



// ====================================================================
// ESTATÍSTICAS DA BIBLIOTECA
// ====================================================================
export async function getLibraryStatsService(userId) {

  const items = await prisma.userMedia.findMany({
    where: { userId },
    select: {
      favorite: true,
      watched: true,
      rating: true,
      notes: true,
      calendarAt: true
    }
  });

  const total = items.length;

  const favorites = items.filter(i => i.favorite).length;
  const watched = items.filter(i => i.watched).length;
  const withNotes = items.filter(i => i.notes?.trim()).length;
  const scheduled = items.filter(i => i.calendarAt !== null).length;

  const ratings = items.filter(i => typeof i.rating === "number");
  const averageRating =
    ratings.length > 0
      ? Number(
          (ratings.reduce((acc, cur) => acc + cur.rating, 0) / ratings.length).toFixed(1)
        )
      : null;

  return {
    totalMedia: total,
    favorites,
    watched,
    withNotes,
    scheduled,
    averageRating
  };
}



// ====================================================================
// LISTAR FAVORITOS
// ====================================================================
export async function getFavoritesService(userId) {

  return await prisma.userMedia.findMany({
    where: { userId, favorite: true },
    include: { media: true }
  });
}



// ====================================================================
// LISTAR VISTOS
// ====================================================================
export async function getWatchedService(userId) {

  return await prisma.userMedia.findMany({
    where: { userId, watched: true },
    include: { media: true }
  });
}



// ====================================================================
// LISTAR BIBLIOTECA COMPLETA
// ====================================================================
export async function getUserLibraryService(userId) {

  return await prisma.userMedia.findMany({
    where: { userId },
    include: { media: true }
  });
}



// ====================================================================
// ATUALIZAR ENTRADA DA BIBLIOTECA
// ====================================================================
export async function updateLibraryEntryService(userId, mediaId, body) {

  // Validar dados com Zod
  const parsed = updateLibrarySchema.safeParse(body);
  if (!parsed.success) {
    throw new Error(parsed.error.errors[0].message);
  }

  const update = { ...parsed.data };

  if(parsed.data.watched === true) {
    update.status = "WATCHED";

  }

  if(parsed.data.status === "WATCHED"){
    update.watched = true;
  }

  if(parsed.data.status === "WANT_TO_WATCH"){
    update.watched = false;
    update.calendarAt = null;
  }

  if(parsed.data.status === "WATCHING"){
    update.watched = false;
  }

  if(parsed.data.status === "ABANDONED"){
    update.watched = false;
  }

  const updated = await prisma.userMedia.update({
    where: {
      userId_mediaId: { userId, mediaId }
    },
    data: update
  });

  return updated;
}



// ====================================================================
// ADICIONAR MEDIA À BIBLIOTECA
// ====================================================================
export async function addToLibraryService(userId, mediaId) {

  // Verificar se existe media
  const mediaExists = await prisma.media.findUnique({ where: { id: mediaId } });
  if (!mediaExists) throw new Error("Media not found");

  // Verificar se já está na biblioteca
  const exists = await prisma.userMedia.findUnique({
    where: { userId_mediaId: { userId, mediaId } }
  });

  if (exists) throw new Error("Media already in library");

  return await prisma.userMedia.create({
    data: { userId, mediaId }
  });
}



// ====================================================================
// REMOVER MEDIA DA BIBLIOTECA
// ====================================================================
export async function removeFromLibraryService(userId, mediaId) {

  await prisma.userMedia.delete({
    where: {
      userId_mediaId: { userId, mediaId }
    }
  });

  return { message: "Media removed from library" };
}
