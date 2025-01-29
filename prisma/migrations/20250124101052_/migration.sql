/*
  Warnings:

  - Added the required column `entrepriseId` to the `Employe` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `employe` DROP FOREIGN KEY `Employe_id_fkey`;

-- AlterTable
ALTER TABLE `employe` ADD COLUMN `entrepriseId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Employe` ADD CONSTRAINT `Employe_entrepriseId_fkey` FOREIGN KEY (`entrepriseId`) REFERENCES `Entreprise`(`siret`) ON DELETE RESTRICT ON UPDATE CASCADE;
