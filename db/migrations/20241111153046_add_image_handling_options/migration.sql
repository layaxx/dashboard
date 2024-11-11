-- CreateEnum
CREATE TYPE "ImageHandling" AS ENUM ('NONE', 'SUPPRESS', 'LIMIT_HEIGHT_10');

-- AlterTable
ALTER TABLE "Feedoption" ADD COLUMN     "imageHandling" "ImageHandling" NOT NULL DEFAULT 'NONE';
