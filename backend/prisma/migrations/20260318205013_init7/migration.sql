/*
  Warnings:

  - A unique constraint covering the columns `[companyId,name]` on the table `EmployeePosition` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `EmployeePosition_companyId_name_key` ON `EmployeePosition`(`companyId`, `name`);
