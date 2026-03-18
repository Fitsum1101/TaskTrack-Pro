/*
  Warnings:

  - A unique constraint covering the columns `[teamId,name]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Project_teamId_name_key` ON `Project`(`teamId`, `name`);
