/*
  Warnings:

  - You are about to drop the column `quranVerseRotation` on the `DisplaySettings` table. All the data in the column will be lost.
  - You are about to drop the `QuranVerse` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[clerkOrgId]` on the table `Mosque` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('QURAN', 'HADITH');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO');

-- AlterTable
ALTER TABLE "DisplaySettings" DROP COLUMN "quranVerseRotation",
ADD COLUMN     "infoDuration" INTEGER NOT NULL DEFAULT 30,
ADD COLUMN     "mediaInterval" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "secondaryColor" TEXT NOT NULL DEFAULT '#3b82f6',
ADD COLUMN     "transitionEffect" TEXT NOT NULL DEFAULT 'fade';

-- AlterTable
ALTER TABLE "Mosque" ADD COLUMN     "asrMethod" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "clerkOrgId" TEXT,
ADD COLUMN     "iqamahOffsets" JSONB;

-- DropTable
DROP TABLE "QuranVerse";

-- CreateTable
CREATE TABLE "WeatherSettings" (
    "id" TEXT NOT NULL,
    "mosqueId" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'metric',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeatherSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuranHadith" (
    "id" TEXT NOT NULL,
    "mosqueId" TEXT NOT NULL,
    "type" "ContentType" NOT NULL,
    "textArabic" TEXT NOT NULL,
    "textTranslation" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuranHadith_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Donation" (
    "id" TEXT NOT NULL,
    "mosqueId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "qrCodeUrl" TEXT,
    "targetAmount" DOUBLE PRECISION,
    "currentAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "mosqueId" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT,
    "duration" INTEGER NOT NULL DEFAULT 10,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WeatherSettings_mosqueId_key" ON "WeatherSettings"("mosqueId");

-- CreateIndex
CREATE INDEX "QuranHadith_mosqueId_isActive_idx" ON "QuranHadith"("mosqueId", "isActive");

-- CreateIndex
CREATE INDEX "Donation_mosqueId_isActive_idx" ON "Donation"("mosqueId", "isActive");

-- CreateIndex
CREATE INDEX "Media_mosqueId_isActive_sortOrder_idx" ON "Media"("mosqueId", "isActive", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Mosque_clerkOrgId_key" ON "Mosque"("clerkOrgId");

-- CreateIndex
CREATE INDEX "Mosque_clerkOrgId_idx" ON "Mosque"("clerkOrgId");

-- AddForeignKey
ALTER TABLE "WeatherSettings" ADD CONSTRAINT "WeatherSettings_mosqueId_fkey" FOREIGN KEY ("mosqueId") REFERENCES "Mosque"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuranHadith" ADD CONSTRAINT "QuranHadith_mosqueId_fkey" FOREIGN KEY ("mosqueId") REFERENCES "Mosque"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_mosqueId_fkey" FOREIGN KEY ("mosqueId") REFERENCES "Mosque"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_mosqueId_fkey" FOREIGN KEY ("mosqueId") REFERENCES "Mosque"("id") ON DELETE CASCADE ON UPDATE CASCADE;
