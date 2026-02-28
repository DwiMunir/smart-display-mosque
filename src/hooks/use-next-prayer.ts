"use client";

import { useCurrentTime } from "./use-current-time";
import type { PrayerTimeData } from "@/types/prayer-times";

interface NextPrayerInfo {
  prayer: PrayerTimeData;
  countdown: { hours: number; minutes: number; seconds: number };
}

function computeNextPrayer(
  prayers: PrayerTimeData[],
  currentTime: Date,
  timezone: string
): NextPrayerInfo {
  const nowStr = currentTime.toLocaleTimeString("en-GB", {
    timeZone: timezone,
    hour12: false,
  });
  const [nowH, nowM, nowS] = nowStr.split(":").map(Number);
  const nowTotalSec = nowH * 3600 + nowM * 60 + nowS;

  for (const prayer of prayers) {
    const [h, m] = prayer.time.split(":").map(Number);
    const prayerTotalSec = h * 3600 + m * 60;
    if (prayerTotalSec > nowTotalSec) {
      const diff = prayerTotalSec - nowTotalSec;
      return {
        prayer,
        countdown: {
          hours: Math.floor(diff / 3600),
          minutes: Math.floor((diff % 3600) / 60),
          seconds: diff % 60,
        },
      };
    }
  }

  // All prayers passed, wrap to first prayer tomorrow
  const firstPrayer = prayers[0];
  const [h, m] = firstPrayer.time.split(":").map(Number);
  const prayerTotalSec = h * 3600 + m * 60;
  const diff = 86400 - nowTotalSec + prayerTotalSec;
  return {
    prayer: firstPrayer,
    countdown: {
      hours: Math.floor(diff / 3600),
      minutes: Math.floor((diff % 3600) / 60),
      seconds: diff % 60,
    },
  };
}

export function useNextPrayer(
  prayers: PrayerTimeData[] | undefined,
  timezone: string = "UTC"
): NextPrayerInfo | null {
  const currentTime = useCurrentTime();

  if (!prayers || prayers.length === 0) return null;

  return computeNextPrayer(prayers, currentTime, timezone);
}
