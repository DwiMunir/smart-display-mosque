import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { fetchPrayerTimes, getMockPrayerTimes } from "@/lib/aladhan";
import {
  calculatePrayerTimesWithMeta,
  calculateIqamahTimes,
  type IqamahOffsets,
} from "@/lib/prayer-time-calculator";
import { fetchWeather, getMockWeather } from "@/lib/api/weather";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const mosque = await prisma.mosque.findUnique({
    where: { slug, isActive: true },
    include: {
      displaySettings: true,
      weatherSettings: true,
      quranHadith: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      },
      donations: {
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
      },
      media: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      },
      announcements: {
        where: {
          isActive: true,
          startDate: { lte: new Date() },
          OR: [{ endDate: null }, { endDate: { gte: new Date() } }],
        },
        orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
      },
      prayerTimeOverrides: {
        where: {
          date: {
            gte: new Date(new Date().toISOString().split("T")[0]),
            lt: new Date(
              new Date(Date.now() + 86400000).toISOString().split("T")[0],
            ),
          },
        },
        take: 1,
      },
    },
  });

  if (!mosque) {
    return NextResponse.json({ error: "Mosque not found" }, { status: 404 });
  }

  // Prayer times
  let prayerData;
  try {
    const raw = await fetchPrayerTimes(
      mosque.latitude,
      mosque.longitude,
      mosque.calculationMethod,
    );
    const override = mosque.prayerTimeOverrides[0];
    const overrides = override
      ? {
          fajr: override.fajr,
          dhuhr: override.dhuhr,
          asr: override.asr,
          maghrib: override.maghrib,
          isha: override.isha,
        }
      : undefined;
    prayerData = calculatePrayerTimesWithMeta(raw, mosque.timezone, overrides);
  } catch {
    const mock = getMockPrayerTimes();
    prayerData = calculatePrayerTimesWithMeta(mock, mosque.timezone);
  }

  // Apply iqamah offsets
  const iqamahOffsets = mosque.iqamahOffsets as IqamahOffsets | null;
  const prayersWithIqamah = calculateIqamahTimes(
    prayerData.prayers,
    iqamahOffsets,
  );
  prayerData = { ...prayerData, prayers: prayersWithIqamah };

  // Weather - use coordinates for precision, fallback to city name
  let weather = null;
  try {
    const weatherLocation =
      mosque.weatherSettings?.location ||
      `${mosque.latitude},${mosque.longitude}`;
    const apiKey = process.env.WEATHER_API_KEY;
    if (apiKey && weatherLocation) {
      weather = await fetchWeather(weatherLocation, apiKey);
      console.log("Fetched weather:", weather);
    } else {
      weather = getMockWeather();
    }
  } catch {
    weather = getMockWeather();
  }

  // Quran/Hadith
  const quranHadith = mosque.quranHadith.map((qh) => ({
    id: qh.id,
    type: qh.type,
    textArabic: qh.textArabic,
    textTranslation: qh.textTranslation,
    reference: qh.reference,
  }));

  // Donations
  const donations = mosque.donations.map((d) => ({
    id: d.id,
    title: d.title,
    description: d.description,
    qrCodeUrl: d.qrCodeUrl,
    targetAmount: d.targetAmount,
    currentAmount: d.currentAmount,
    currency: d.currency,
  }));

  // Media
  const media = mosque.media.map((m) => ({
    id: m.id,
    type: m.type,
    url: m.url,
    title: m.title,
    duration: m.duration,
  }));

  // Announcements
  const announcements = mosque.announcements.map((a) => ({
    id: a.id,
    title: a.title,
    content: a.content,
    priority: a.priority,
  }));

  return NextResponse.json({
    mosque: {
      name: mosque.name,
      slug: mosque.slug,
      timezone: mosque.timezone,
      logoUrl: mosque.logoUrl,
      city: mosque.city,
      country: mosque.country,
    },
    displaySettings: mosque.displaySettings || {
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
    weatherSettings: mosque.weatherSettings
      ? { unit: mosque.weatherSettings.unit }
      : { unit: "metric" },
    prayerTimes: prayerData,
    weather,
    quranHadith,
    donations,
    media,
    announcements,
  });
}
