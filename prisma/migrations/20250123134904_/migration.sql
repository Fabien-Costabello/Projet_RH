/*
  Warnings:

  - Added the required column `raisonSociale` to the `Entreprise` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `entreprise` ADD COLUMN `raisonSociale` VARCHAR(191) NOT NULL;
