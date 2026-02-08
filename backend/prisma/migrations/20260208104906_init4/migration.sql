/*
  Warnings:

  - A unique constraint covering the columns `[companyId,name]` on the table `Team` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Team_companyId_name_key` ON `Team`(`companyId`, `name`);
