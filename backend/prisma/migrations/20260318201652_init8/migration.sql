/*
  Warnings:

  - A unique constraint covering the columns `[moduleId,title]` on the table `Task` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Task_moduleId_title_key` ON `Task`(`moduleId`, `title`);
