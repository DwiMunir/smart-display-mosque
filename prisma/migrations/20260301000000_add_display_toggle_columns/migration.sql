-- AlterTable
ALTER TABLE "DisplaySettings"
ADD COLUMN     "showPrayerTimes" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showAnnouncements" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showWeather" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showDonations" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showQuranHadith" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showClock" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showCountdown" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showLocation" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showLogo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "marqueeSpeed" INTEGER NOT NULL DEFAULT 25;
