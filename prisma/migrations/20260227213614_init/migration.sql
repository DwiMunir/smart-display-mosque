-- CreateTable
CREATE TABLE "Mosque" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "calculationMethod" INTEGER NOT NULL DEFAULT 2,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mosque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DisplaySettings" (
    "id" TEXT NOT NULL,
    "mosqueId" TEXT NOT NULL,
    "theme" TEXT NOT NULL DEFAULT 'dark',
    "primaryColor" TEXT NOT NULL DEFAULT '#10b981',
    "showHijriDate" BOOLEAN NOT NULL DEFAULT true,
    "showGregorianDate" BOOLEAN NOT NULL DEFAULT true,
    "announcementDuration" INTEGER NOT NULL DEFAULT 10,
    "quranVerseRotation" TEXT NOT NULL DEFAULT 'daily',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DisplaySettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrayerTimeOverride" (
    "id" TEXT NOT NULL,
    "mosqueId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "fajr" TEXT,
    "dhuhr" TEXT,
    "asr" TEXT,
    "maghrib" TEXT,
    "isha" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrayerTimeOverride_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" TEXT NOT NULL,
    "mosqueId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuranVerse" (
    "id" TEXT NOT NULL,
    "surahNumber" INTEGER NOT NULL,
    "surahNameArabic" TEXT NOT NULL,
    "surahNameEnglish" TEXT NOT NULL,
    "verseNumber" INTEGER NOT NULL,
    "textArabic" TEXT NOT NULL,
    "textTranslation" TEXT NOT NULL,
    "textTransliteration" TEXT,
    "dayOfYear" INTEGER,

    CONSTRAINT "QuranVerse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Mosque_slug_key" ON "Mosque"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "DisplaySettings_mosqueId_key" ON "DisplaySettings"("mosqueId");

-- CreateIndex
CREATE UNIQUE INDEX "PrayerTimeOverride_mosqueId_date_key" ON "PrayerTimeOverride"("mosqueId", "date");

-- CreateIndex
CREATE INDEX "Announcement_mosqueId_idx" ON "Announcement"("mosqueId");

-- CreateIndex
CREATE INDEX "Announcement_isActive_startDate_endDate_idx" ON "Announcement"("isActive", "startDate", "endDate");

-- CreateIndex
CREATE INDEX "QuranVerse_dayOfYear_idx" ON "QuranVerse"("dayOfYear");

-- CreateIndex
CREATE INDEX "QuranVerse_surahNumber_verseNumber_idx" ON "QuranVerse"("surahNumber", "verseNumber");

-- AddForeignKey
ALTER TABLE "DisplaySettings" ADD CONSTRAINT "DisplaySettings_mosqueId_fkey" FOREIGN KEY ("mosqueId") REFERENCES "Mosque"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrayerTimeOverride" ADD CONSTRAINT "PrayerTimeOverride_mosqueId_fkey" FOREIGN KEY ("mosqueId") REFERENCES "Mosque"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_mosqueId_fkey" FOREIGN KEY ("mosqueId") REFERENCES "Mosque"("id") ON DELETE CASCADE ON UPDATE CASCADE;
