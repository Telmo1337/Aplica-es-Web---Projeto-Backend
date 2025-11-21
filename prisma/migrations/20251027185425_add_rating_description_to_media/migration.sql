/*
  Warnings:

  - A unique constraint covering the columns `[userId,mediaId]` on the table `UserMedia` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Media` ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `rating` INTEGER NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `updatedAt` DATETIME(3) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `UserMedia_userId_mediaId_key` ON `UserMedia`(`userId`, `mediaId`);
