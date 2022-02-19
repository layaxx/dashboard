/*
  Warnings:

  - A unique constraint covering the columns `[hashedToken,type]` on the table `Token` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `type` on the `Token` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('RESET_PASSWORD');

-- AlterTable
ALTER TABLE "Token" DROP COLUMN "type",
ADD COLUMN     "type" "TokenType" NOT NULL;

-- CreateTable
CREATE TABLE "Readlistentry" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Readlistentry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Token_hashedToken_type_key" ON "Token"("hashedToken", "type");
