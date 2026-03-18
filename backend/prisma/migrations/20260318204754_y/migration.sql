/*
  Warnings:

  - You are about to drop the column `userId` on the `taskcomment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `taskcomment` DROP FOREIGN KEY `TaskComment_userId_fkey`;

-- DropIndex
DROP INDEX `TaskComment_userId_fkey` ON `taskcomment`;

-- AlterTable
ALTER TABLE `taskcomment` DROP COLUMN `userId`;
