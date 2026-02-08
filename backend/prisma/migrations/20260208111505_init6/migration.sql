/*
  Warnings:

  - A unique constraint covering the columns `[projectId,title]` on the table `Task` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Task_projectId_title_key` ON `Task`(`projectId`, `title`);
