/*
  Warnings:

  - You are about to drop the column `loadDurations` on the `Status` table. All the data in the column will be lost.
  - You are about to drop the column `loadTimes` on the `Status` table. All the data in the column will be lost.
  - Added the required column `loadDuration` to the `Status` table without a default value. This is not possible if the table is not empty.
  - Added the required column `loadTime` to the `Status` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Status" DROP COLUMN "loadDurations",
DROP COLUMN "loadTimes",
ADD COLUMN     "loadDuration" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "loadTime" TIMESTAMP(3) NOT NULL;
