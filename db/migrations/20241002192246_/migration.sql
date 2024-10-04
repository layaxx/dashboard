-- CreateTable
CREATE TABLE "FeedLoadEvent" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "feedId" INTEGER NOT NULL,
    "updatedIds" TEXT[],
    "createdIds" TEXT[],
    "errors" TEXT[],

    CONSTRAINT "FeedLoadEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Feedoption" ADD CONSTRAINT "Feedoption_id_fkey" FOREIGN KEY ("id") REFERENCES "Feed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedLoadEvent" ADD CONSTRAINT "FeedLoadEvent_feedId_fkey" FOREIGN KEY ("feedId") REFERENCES "Feed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
