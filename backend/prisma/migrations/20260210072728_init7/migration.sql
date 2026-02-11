-- DropForeignKey
ALTER TABLE `project` DROP FOREIGN KEY `Project_teamId_fkey`;

-- AlterTable
ALTER TABLE `project` MODIFY `teamId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
