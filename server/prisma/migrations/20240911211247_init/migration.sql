-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `recoveryCode` VARCHAR(191) NOT NULL DEFAULT '',
    `description` VARCHAR(191) NOT NULL DEFAULT '',
    `avatar` VARCHAR(191) NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Setting` (
    `idSetting` VARCHAR(191) NOT NULL,
    `idUser` VARCHAR(191) NOT NULL,
    `private` BOOLEAN NOT NULL DEFAULT false,
    `n_ratings` BOOLEAN NOT NULL DEFAULT true,
    `n_comments` BOOLEAN NOT NULL DEFAULT true,
    `n_followers` BOOLEAN NOT NULL DEFAULT true,
    `n_populates` BOOLEAN NOT NULL DEFAULT true,
    `n_email_ratings` BOOLEAN NOT NULL DEFAULT true,
    `n_email_comments` BOOLEAN NOT NULL DEFAULT true,
    `n_email_followers` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `Setting_idUser_key`(`idUser`),
    PRIMARY KEY (`idSetting`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Post` (
    `id` VARCHAR(191) NOT NULL,
    `idUser` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `preview` VARCHAR(191) NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comment` (
    `id` VARCHAR(191) NOT NULL,
    `idPost` VARCHAR(191) NOT NULL,
    `idUser` VARCHAR(191) NOT NULL,
    `text` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Technology` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Technology_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Stack` (
    `idPost` VARCHAR(191) NOT NULL,
    `idTechnology` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idPost`, `idTechnology`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rating` (
    `idPost` VARCHAR(191) NOT NULL,
    `idUser` VARCHAR(191) NOT NULL,
    `rating` DOUBLE NOT NULL,

    PRIMARY KEY (`idPost`, `idUser`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Follower` (
    `idFollower` VARCHAR(191) NOT NULL,
    `idFollowing` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idFollower`, `idFollowing`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `File` (
    `id` VARCHAR(191) NOT NULL,
    `idPost` VARCHAR(191) NOT NULL,
    `file` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Post_saved` (
    `idUser` VARCHAR(191) NOT NULL,
    `idPost` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idPost`, `idUser`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` VARCHAR(191) NOT NULL,
    `idUser` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `read` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Setting` ADD CONSTRAINT `Setting_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_idPost_fkey` FOREIGN KEY (`idPost`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Stack` ADD CONSTRAINT `Stack_idPost_fkey` FOREIGN KEY (`idPost`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Stack` ADD CONSTRAINT `Stack_idTechnology_fkey` FOREIGN KEY (`idTechnology`) REFERENCES `Technology`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rating` ADD CONSTRAINT `Rating_idPost_fkey` FOREIGN KEY (`idPost`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rating` ADD CONSTRAINT `Rating_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Follower` ADD CONSTRAINT `Follower_idFollower_fkey` FOREIGN KEY (`idFollower`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Follower` ADD CONSTRAINT `Follower_idFollowing_fkey` FOREIGN KEY (`idFollowing`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `File_idPost_fkey` FOREIGN KEY (`idPost`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post_saved` ADD CONSTRAINT `Post_saved_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post_saved` ADD CONSTRAINT `Post_saved_idPost_fkey` FOREIGN KEY (`idPost`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
