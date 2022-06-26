/*
  Warnings:

  - Added the required column `summary` to the `Feedentry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Feedentry" ADD COLUMN     "summary" TEXT NOT NULL;
