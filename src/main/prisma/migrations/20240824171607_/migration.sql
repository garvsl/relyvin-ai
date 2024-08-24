/*
  Warnings:

  - The primary key for the `Profile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `bio` on the `Profile` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[handle]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hashedPassword` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- AlterTable
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_pkey",
DROP COLUMN "bio",
ADD COLUMN     "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "handle" TEXT,
ADD COLUMN     "interests" TEXT,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "quote" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'initial contact',
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Profile_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Profile_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "name",
ADD COLUMN     "hashedPassword" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "email" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- DropTable
DROP TABLE "Post";

-- CreateTable
CREATE TABLE "Script" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Script_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Influencer" (
    "id" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Influencer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Email" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT,
    "needsResponse" BOOLEAN NOT NULL DEFAULT true,
    "you" BOOLEAN NOT NULL DEFAULT false,
    "aiResponse" TEXT,
    "profileId" TEXT NOT NULL,

    CONSTRAINT "Email_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Text" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT,
    "needsResponse" BOOLEAN NOT NULL DEFAULT true,
    "you" BOOLEAN NOT NULL DEFAULT false,
    "aiResponse" TEXT,
    "profileId" TEXT NOT NULL,

    CONSTRAINT "Text_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meeting" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "agenda" TEXT,
    "date" TIMESTAMP(3),
    "link" TEXT,
    "transcript" TEXT,
    "profileId" TEXT NOT NULL,

    CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Influencer_handle_key" ON "Influencer"("handle");

-- CreateIndex
CREATE UNIQUE INDEX "Influencer_email_key" ON "Influencer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_email_key" ON "Profile"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_phone_key" ON "Profile"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_handle_key" ON "Profile"("handle");

-- AddForeignKey
ALTER TABLE "Script" ADD CONSTRAINT "Script_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Email" ADD CONSTRAINT "Email_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Text" ADD CONSTRAINT "Text_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
