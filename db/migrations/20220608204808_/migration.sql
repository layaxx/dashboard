-- CreateTable
CREATE TABLE "Status" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "loadTimes" TIMESTAMP(3)[],
    "loadDurations" DOUBLE PRECISION[],
    "errors" TEXT[],

    CONSTRAINT "Status_pkey" PRIMARY KEY ("id")
);
