/*
  Warnings:

  - The primary key for the `Feedentry` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Feedentry" DROP CONSTRAINT "Feedentry_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Feedentry_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Feedentry_id_seq";
