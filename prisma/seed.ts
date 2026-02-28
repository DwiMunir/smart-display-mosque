import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clear existing data in dependency order
  await prisma.announcement.deleteMany();
  await prisma.prayerTimeOverride.deleteMany();
  await prisma.quranHadith.deleteMany();
  await prisma.donation.deleteMany();
  await prisma.media.deleteMany();
  await prisma.weatherSettings.deleteMany();
  await prisma.displaySettings.deleteMany();
  await prisma.mosque.deleteMany();

  // Create mosques with all related data
  const mosques = await Promise.all([
    prisma.mosque.create({
      data: {
        slug: "masjid-al-huda",
        name: "Masjid Al-Huda",
        city: "New York",
        country: "United States",
        latitude: 40.7128,
        longitude: -74.006,
        timezone: "America/New_York",
        calculationMethod: 2,
        asrMethod: 0,
        iqamahOffsets: { fajr: 20, dhuhr: 15, asr: 10, maghrib: 5, isha: 15 },
        isActive: true,
        displaySettings: {
          create: {
            theme: "dark",
            primaryColor: "#10b981",
            secondaryColor: "#3b82f6",
            showHijriDate: true,
            showGregorianDate: true,
            announcementDuration: 10,
            transitionEffect: "fade",
            mediaInterval: 10,
            infoDuration: 30,
          },
        },
        weatherSettings: {
          create: {
            location: "New York",
            unit: "imperial",
          },
        },
      },
    }),
    prisma.mosque.create({
      data: {
        slug: "london-central-mosque",
        name: "London Central Mosque",
        city: "London",
        country: "United Kingdom",
        latitude: 51.5074,
        longitude: -0.1278,
        timezone: "Europe/London",
        calculationMethod: 3,
        asrMethod: 1,
        iqamahOffsets: { fajr: 15, dhuhr: 10, asr: 10, maghrib: 5, isha: 10 },
        isActive: true,
        displaySettings: {
          create: {
            theme: "dark",
            primaryColor: "#3b82f6",
            secondaryColor: "#10b981",
            showHijriDate: true,
            showGregorianDate: true,
            announcementDuration: 12,
            transitionEffect: "slide",
            mediaInterval: 8,
            infoDuration: 25,
          },
        },
        weatherSettings: {
          create: {
            location: "London",
            unit: "metric",
          },
        },
      },
    }),
    prisma.mosque.create({
      data: {
        slug: "jumeirah-mosque",
        name: "Jumeirah Mosque",
        city: "Dubai",
        country: "United Arab Emirates",
        latitude: 25.2048,
        longitude: 55.2708,
        timezone: "Asia/Dubai",
        calculationMethod: 4,
        asrMethod: 0,
        iqamahOffsets: { fajr: 15, dhuhr: 10, asr: 10, maghrib: 3, isha: 10 },
        isActive: true,
        displaySettings: {
          create: {
            theme: "dark",
            primaryColor: "#d4a843",
            secondaryColor: "#3b82f6",
            showHijriDate: true,
            showGregorianDate: true,
            announcementDuration: 8,
            transitionEffect: "zoom",
            mediaInterval: 12,
            infoDuration: 35,
          },
        },
        weatherSettings: {
          create: {
            location: "Dubai",
            unit: "metric",
          },
        },
      },
    }),
  ]);

  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  for (const mosque of mosques) {
    // Announcements
    await prisma.announcement.createMany({
      data: [
        {
          mosqueId: mosque.id,
          title: "Jumuah Prayer Time Update",
          content:
            "Jumuah prayer has been moved to 1:30 PM starting this week. First khutbah begins at 1:00 PM.",
          priority: "urgent",
          startDate: now,
          endDate: nextWeek,
          isActive: true,
        },
        {
          mosqueId: mosque.id,
          title: "Quran Study Circle",
          content:
            "Join our weekly Quran study circle every Sunday after Maghrib prayer. Open to all ages and levels.",
          priority: "medium",
          startDate: now,
          endDate: null,
          isActive: true,
        },
        {
          mosqueId: mosque.id,
          title: "Community Iftar Program",
          content:
            "Daily community iftar during Ramadan. Volunteers needed for food preparation and setup.",
          priority: "high",
          startDate: now,
          endDate: nextMonth,
          isActive: true,
        },
        {
          mosqueId: mosque.id,
          title: "Islamic School Registration",
          content:
            "Registration for the weekend Islamic school is now open for children ages 5-15.",
          priority: "medium",
          startDate: now,
          endDate: nextMonth,
          isActive: true,
        },
      ],
    });

    // Quran & Hadith
    await prisma.quranHadith.createMany({
      data: [
        {
          mosqueId: mosque.id,
          type: "QURAN",
          textArabic:
            "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ",
          textTranslation:
            "Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep.",
          reference: "Surah Al-Baqarah 2:255 (Ayat al-Kursi)",
          isActive: true,
          sortOrder: 0,
        },
        {
          mosqueId: mosque.id,
          type: "QURAN",
          textArabic:
            "وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ",
          textTranslation:
            "And your Lord is going to give you, and you will be satisfied.",
          reference: "Surah Ad-Duha 93:5",
          isActive: true,
          sortOrder: 1,
        },
        {
          mosqueId: mosque.id,
          type: "QURAN",
          textArabic:
            "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ، إِنَّ مَعَ الْعُسْرِ يُسْرًا",
          textTranslation:
            "For indeed, with hardship will be ease. Indeed, with hardship will be ease.",
          reference: "Surah Ash-Sharh 94:5-6",
          isActive: true,
          sortOrder: 2,
        },
        {
          mosqueId: mosque.id,
          type: "QURAN",
          textArabic:
            "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
          textTranslation:
            "Unquestionably, by the remembrance of Allah hearts are assured.",
          reference: "Surah Ar-Ra'd 13:28",
          isActive: true,
          sortOrder: 3,
        },
        {
          mosqueId: mosque.id,
          type: "HADITH",
          textArabic:
            "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ",
          textTranslation:
            "Actions are judged by intentions, and every person will get what they intended.",
          reference: "Sahih al-Bukhari 1, Sahih Muslim 1907",
          isActive: true,
          sortOrder: 4,
        },
        {
          mosqueId: mosque.id,
          type: "HADITH",
          textArabic:
            "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
          textTranslation:
            "The best among you are those who learn the Quran and teach it.",
          reference: "Sahih al-Bukhari 5027",
          isActive: true,
          sortOrder: 5,
        },
        {
          mosqueId: mosque.id,
          type: "HADITH",
          textArabic:
            "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
          textTranslation:
            "None of you truly believes until he loves for his brother what he loves for himself.",
          reference: "Sahih al-Bukhari 13, Sahih Muslim 45",
          isActive: true,
          sortOrder: 6,
        },
      ],
    });

    // Donation
    await prisma.donation.create({
      data: {
        mosqueId: mosque.id,
        title: "Mosque Expansion Fund",
        description:
          "Help us expand our prayer hall to accommodate the growing community. Every contribution counts.",
        qrCodeUrl: null,
        targetAmount: 50000,
        currentAmount: 23500,
        currency: "USD",
        isActive: true,
      },
    });
  }

  console.log("Seed complete:");
  console.log(`  - ${mosques.length} mosques created (with display + weather settings)`);
  console.log(`  - ${mosques.length * 4} announcements created`);
  console.log(`  - ${mosques.length * 7} quran/hadith items created`);
  console.log(`  - ${mosques.length} donation campaigns created`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
