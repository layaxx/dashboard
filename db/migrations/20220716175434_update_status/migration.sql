/*
  Warnings:

  - You are about to drop the `Status` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
ALTER TABLE "Status" RENAME TO "StatusLoad";

-- CreateTable
CREATE TABLE "StatusClean" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "StatusClean_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "StatusLoad" RENAME CONSTRAINT "Status_pkey" TO "StatusLoad_pkey";
