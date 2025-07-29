/*
  Warnings:

  - Added the required column `startDate` to the `Deal` table without a default value. This is not possible if the table is not empty.
  - Made the column `durationMinutes` on table `Deal` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Deal" ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "durationMinutes" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Deal_startDate_idx" ON "Deal"("startDate");
