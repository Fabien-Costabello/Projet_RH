/*
  Warnings:

  - Added the required column `companyId` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `event` ADD COLUMN `companyId` INTEGER NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL;
