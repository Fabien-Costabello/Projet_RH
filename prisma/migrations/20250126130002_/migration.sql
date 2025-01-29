/*
  Warnings:

  - A unique constraint covering the columns `[ordinateurID]` on the table `Employe` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[employeId]` on the table `Ordinateur` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `ordinateur` DROP FOREIGN KEY `Ordinateur_employeId_fkey`;

-- DropIndex
DROP INDEX `Ordinateur_employeId_fkey` ON `ordinateur`;

-- AlterTable
ALTER TABLE `employe` ADD COLUMN `ordinateurID` INTEGER NULL;

-- AlterTable
ALTER TABLE `ordinateur` MODIFY `Working` BOOLEAN NOT NULL DEFAULT true,
    MODIFY `employeId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Employe_ordinateurID_key` ON `Employe`(`ordinateurID`);

-- CreateIndex
CREATE UNIQUE INDEX `Ordinateur_employeId_key` ON `Ordinateur`(`employeId`);

-- AddForeignKey
ALTER TABLE `Ordinateur` ADD CONSTRAINT `Ordinateur_employeId_fkey` FOREIGN KEY (`employeId`) REFERENCES `Employe`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
