import { prisma } from "@/lib/db";
import { getDefaultQuranHadithForMosque } from "@/lib/default-quran-hadith";

/**
 * Seeds default Quran and Hadith content for a newly created mosque
 * This should be called after creating a new mosque to populate it with default content
 *
 * @param mosqueId - The ID of the mosque to seed content for
 * @returns The number of items created
 */
export async function seedDefaultQuranHadith(mosqueId: string) {
  const data = getDefaultQuranHadithForMosque(mosqueId);

  await prisma.quranHadith.createMany({
    data,
    skipDuplicates: true,
  });

  return data.length;
}

/**
 * Creates a new mosque with all default settings and content
 * This is a complete setup function that includes:
 * - Display settings
 * - Weather settings
 * - Default Quran & Hadith collection
 *
 * @param mosqueData - Basic mosque information
 * @returns The created mosque with all relations
 */
export async function createMosqueWithDefaults(mosqueData: {
  slug: string;
  name: string;
  clerkOrgId?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  calculationMethod?: number;
  asrMethod?: number;
  logoUrl?: string;
}) {
  // Create mosque with display and weather settings
  const mosque = await prisma.mosque.create({
    data: {
      slug: mosqueData.slug,
      name: mosqueData.name,
      clerkOrgId: mosqueData.clerkOrgId,
      city: mosqueData.city || "",
      country: mosqueData.country || "",
      latitude: mosqueData.latitude || 0,
      longitude: mosqueData.longitude || 0,
      timezone: mosqueData.timezone || "UTC",
      calculationMethod: mosqueData.calculationMethod ?? 2, // Default: MWL
      asrMethod: mosqueData.asrMethod ?? 0, // Default: Shafi
      logoUrl: mosqueData.logoUrl,
      iqamahOffsets: { fajr: 15, dhuhr: 10, asr: 10, maghrib: 5, isha: 15 },
      isActive: true,
      displaySettings: {
        create: {
          theme: "dark",
          primaryColor: "#10b981",
          secondaryColor: "#3b82f6",
          showHijriDate: true,
          showGregorianDate: true,
          clockFormat: "12h",
          announcementDuration: 10,
          transitionEffect: "fade",
          mediaInterval: 10,
          infoDuration: 30,
          showPrayerTimes: true,
          showAnnouncements: true,
          showWeather: true,
          showDonations: true,
          showQuranHadith: true,
          showClock: true,
          showCountdown: true,
          showLocation: true,
          showLogo: true,
          marqueeSpeed: 25,
        },
      },
      weatherSettings: {
        create: {
          location: mosqueData.city || "",
          unit: "metric",
        },
      },
    },
    include: {
      displaySettings: true,
      weatherSettings: true,
    },
  });

  // Seed default Quran & Hadith
  await seedDefaultQuranHadith(mosque.id);

  return mosque;
}

/**
 * Checks if a mosque has Quran/Hadith content, if not, seeds it
 * Useful for existing mosques that might be missing default content
 *
 * @param mosqueId - The ID of the mosque to check
 * @returns True if content was seeded, false if it already existed
 */
export async function ensureQuranHadithContent(mosqueId: string) {
  const count = await prisma.quranHadith.count({
    where: { mosqueId },
  });

  if (count === 0) {
    await seedDefaultQuranHadith(mosqueId);
    return true;
  }

  return false;
}
