/*
  Warnings:

  - Added the required column `lastLoad` to the `Feed` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Feed" ADD COLUMN     "lastLoad" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "loadIntervall" INTEGER NOT NULL DEFAULT 60;

-- CreateTable
CREATE TABLE "Feedentry" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "feedId" INTEGER NOT NULL,

    CONSTRAINT "Feedentry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Feedentry" ADD CONSTRAINT "Feedentry_feedId_fkey" FOREIGN KEY ("feedId") REFERENCES "Feed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
