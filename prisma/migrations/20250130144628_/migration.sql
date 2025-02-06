/*
  Warnings:

  - You are about to drop the column `companyId` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `event` DROP COLUMN `companyId`,
    DROP COLUMN `userId`;
