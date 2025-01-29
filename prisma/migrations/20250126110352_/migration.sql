-- CreateTable
CREATE TABLE `Ordinateur` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `macAdress` INTEGER NOT NULL,
    `Working` BOOLEAN NOT NULL,
    `entrepriseId` INTEGER NOT NULL,
    `employeId` INTEGER NOT NULL,

    UNIQUE INDEX `Ordinateur_macAdress_key`(`macAdress`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Ordinateur` ADD CONSTRAINT `Ordinateur_entrepriseId_fkey` FOREIGN KEY (`entrepriseId`) REFERENCES `Entreprise`(`siret`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ordinateur` ADD CONSTRAINT `Ordinateur_employeId_fkey` FOREIGN KEY (`employeId`) REFERENCES `Employe`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
