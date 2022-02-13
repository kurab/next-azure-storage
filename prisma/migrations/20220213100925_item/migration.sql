-- CreateTable
CREATE TABLE "items" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);
