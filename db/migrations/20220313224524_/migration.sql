/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `Readlistentry` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Readlistentry_url_key" ON "Readlistentry"("url");
