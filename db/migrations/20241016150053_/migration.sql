/*
  Warnings:

  - You are about to drop the column `oldestFirst` on the `Feedoption` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "FeedEntryOrdering" AS ENUM ('OLDEST_FIRST', 'NEWEST_FIRST', 'RANDOM');

-- AlterTable
ALTER TABLE "Feedoption" DROP COLUMN "oldestFirst",
ADD COLUMN     "ordering" "FeedEntryOrdering" NOT NULL DEFAULT 'NEWEST_FIRST';
