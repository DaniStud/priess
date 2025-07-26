/*
  Warnings:

  - You are about to drop the column `businessId` on the `Deal` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `Deal` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - Added the required column `updatedAt` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salonId` to the `Deal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Deal` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Deal" DROP CONSTRAINT "Deal_businessId_fkey";

-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Deal" DROP COLUMN "businessId",
ADD COLUMN     "salonId" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "price" SET DATA TYPE DECIMAL(65,30);

-- CreateTable
CREATE TABLE "Salon" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "businessId" INTEGER NOT NULL,
    "salonTypeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "address" TEXT,
    "city" TEXT,
    "zipCode" TEXT,
    "country" TEXT,

    CONSTRAINT "Salon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalonType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "SalonType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalonService" (
    "id" SERIAL NOT NULL,
    "salonId" INTEGER NOT NULL,
    "serviceId" INTEGER NOT NULL,

    CONSTRAINT "SalonService_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Salon_businessId_idx" ON "Salon"("businessId");

-- CreateIndex
CREATE INDEX "Salon_salonTypeId_idx" ON "Salon"("salonTypeId");

-- CreateIndex
CREATE INDEX "Salon_createdAt_idx" ON "Salon"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "SalonType_name_key" ON "SalonType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Service_name_key" ON "Service"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SalonService_salonId_serviceId_key" ON "SalonService"("salonId", "serviceId");

-- CreateIndex
CREATE INDEX "Deal_salonId_idx" ON "Deal"("salonId");

-- CreateIndex
CREATE INDEX "Deal_expiryDate_idx" ON "Deal"("expiryDate");

-- CreateIndex
CREATE INDEX "Deal_createdAt_idx" ON "Deal"("createdAt");

-- AddForeignKey
ALTER TABLE "Salon" ADD CONSTRAINT "Salon_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Salon" ADD CONSTRAINT "Salon_salonTypeId_fkey" FOREIGN KEY ("salonTypeId") REFERENCES "SalonType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalonService" ADD CONSTRAINT "SalonService_salonId_fkey" FOREIGN KEY ("salonId") REFERENCES "Salon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalonService" ADD CONSTRAINT "SalonService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_salonId_fkey" FOREIGN KEY ("salonId") REFERENCES "Salon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
