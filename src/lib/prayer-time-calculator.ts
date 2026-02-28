import type { PrayerTimesResponse } from "./aladhan";

export interface PrayerTimeEntry {
  name: string;
  nameArabic: string;
  time: string;
  iqamahTime?: string;
  isNext: boolean;
}

export interface IqamahOffsets {
  fajr?: number;
  dhuhr?: number;
  asr?: number;
  maghrib?: number;
  isha?: number;
}

export interface PrayerTimesWithMeta {
  prayers: PrayerTimeEntry[];
  nextPrayer: PrayerTimeEntry | null;
  countdown: { hours: number; minutes: number; seconds: number } | null;
  hijriDate: string | null;
  gregorianDate: string;
}

const PRAYER_NAMES: { key: keyof Pick<PrayerTimesResponse, "fajr" | "dhuhr" | "asr" | "maghrib" | "isha">; name: string; nameArabic: string }[] = [
  { key: "fajr", name: "Fajr", nameArabic: "الفجر" },
  { key: "dhuhr", name: "Dhuhr", nameArabic: "الظهر" },
  { key: "asr", name: "Asr", nameArabic: "العصر" },
  { key: "maghrib", name: "Maghrib", nameArabic: "المغرب" },
  { key: "isha", name: "Isha", nameArabic: "العشاء" },
];

function parseTime(timeStr: string, timezone: string): Date {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-CA", { timeZone: timezone });
  const date = new Date(`${dateStr}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`);
  return date;
}

function getCurrentTimeInTimezone(timezone: string): Date {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-CA", { timeZone: timezone });
  const timeStr = now.toLocaleTimeString("en-GB", { timeZone: timezone, hour12: false });
  return new Date(`${dateStr}T${timeStr}`);
}

function addMinutesToTime(timeStr: string, minutes: number): string {
  const [hours, mins] = timeStr.split(":").map(Number);
  const totalMinutes = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMins = totalMinutes % 60;
  return `${String(newHours).padStart(2, "0")}:${String(newMins).padStart(2, "0")}`;
}

export function calculateIqamahTimes(
  prayers: PrayerTimeEntry[],
  iqamahOffsets: IqamahOffsets | null | undefined
): PrayerTimeEntry[] {
  if (!iqamahOffsets) return prayers;

  const keyMap: Record<string, keyof IqamahOffsets> = {
    Fajr: "fajr",
    Dhuhr: "dhuhr",
    Asr: "asr",
    Maghrib: "maghrib",
    Isha: "isha",
  };

  return prayers.map((prayer) => {
    const offsetKey = keyMap[prayer.name];
    const offset = offsetKey ? iqamahOffsets[offsetKey] : undefined;
    if (offset && offset > 0) {
      return {
        ...prayer,
        iqamahTime: addMinutesToTime(prayer.time, offset),
      };
    }
    return prayer;
  });
}

export function calculatePrayerTimesWithMeta(
  prayerTimes: PrayerTimesResponse,
  timezone: string,
  overrides?: Partial<Record<string, string | null>>
): PrayerTimesWithMeta {
  const currentTime = getCurrentTimeInTimezone(timezone);

  const prayers: PrayerTimeEntry[] = PRAYER_NAMES.map(({ key, name, nameArabic }) => {
    const time = (overrides?.[key] as string) || prayerTimes[key];
    return { name, nameArabic, time, isNext: false };
  });

  let nextPrayer: PrayerTimeEntry | null = null;
  for (const prayer of prayers) {
    const prayerDate = parseTime(prayer.time, timezone);
    if (prayerDate > currentTime) {
      nextPrayer = prayer;
      break;
    }
  }

  if (!nextPrayer && prayers.length > 0) {
    nextPrayer = prayers[0];
  }

  if (nextPrayer) {
    const idx = prayers.findIndex((p) => p.name === nextPrayer!.name);
    if (idx >= 0) prayers[idx] = { ...prayers[idx], isNext: true };
  }

  let countdown: { hours: number; minutes: number; seconds: number } | null = null;
  if (nextPrayer) {
    const nextTime = parseTime(nextPrayer.time, timezone);
    let diffMs = nextTime.getTime() - currentTime.getTime();
    if (diffMs < 0) diffMs += 24 * 60 * 60 * 1000;
    const totalSeconds = Math.floor(diffMs / 1000);
    countdown = {
      hours: Math.floor(totalSeconds / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
    };
  }

  const hijriDate = prayerTimes.date?.hijri
    ? `${prayerTimes.date.hijri.day} ${prayerTimes.date.hijri.month.en} ${prayerTimes.date.hijri.year} AH`
    : null;

  return {
    prayers,
    nextPrayer,
    countdown,
    hijriDate,
    gregorianDate: prayerTimes.date?.readable || currentTime.toLocaleDateString(),
  };
}
