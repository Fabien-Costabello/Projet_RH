-- DropForeignKey
ALTER TABLE `ordinateur` DROP FOREIGN KEY `Ordinateur_employeId_fkey`;

-- AddForeignKey
ALTER TABLE `Employe` ADD CONSTRAINT `Employe_ordinateurID_fkey` FOREIGN KEY (`ordinateurID`) REFERENCES `Ordinateur`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
