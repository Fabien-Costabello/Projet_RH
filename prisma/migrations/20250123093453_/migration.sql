-- CreateTable
CREATE TABLE `Employe` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `mail` VARCHAR(191) NOT NULL,
    `age` INTEGER NOT NULL,
    `Genre` INTEGER NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Employe_mail_key`(`mail`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Entreprise` (
    `siret` INTEGER NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Entreprise_email_key`(`email`),
    PRIMARY KEY (`siret`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Employe` ADD CONSTRAINT `Employe_id_fkey` FOREIGN KEY (`id`) REFERENCES `Entreprise`(`siret`) ON DELETE RESTRICT ON UPDATE CASCADE;
