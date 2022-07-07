-- AlterTable
ALTER TABLE "Feed" ADD COLUMN "etag" TEXT;
ALTER TABLE "Feed" RENAME COLUMN "number" TO "position";
