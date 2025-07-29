/*
  Warnings:

  - Added the required column `originalPrice` to the `Deal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Deal" ADD COLUMN     "originalPrice" DECIMAL(65,30) NOT NULL;
