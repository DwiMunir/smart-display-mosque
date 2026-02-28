"use client";

import { formatCountdown } from "@/lib/date-utils";
import type { PrayerTimeData } from "@/types/prayer-times";
import { useNextPrayer } from "@/hooks/use-next-prayer";

interface PrayerCountdownProps {
  prayers: PrayerTimeData[];
  timezone?: string;
}

export function PrayerCountdown({ prayers, timezone = "UTC" }: PrayerCountdownProps) {
  const nextPrayer = useNextPrayer(prayers, timezone);

  if (!nextPrayer) return null;

  return (
    <div className="flex flex-col items-center gap-2 rounded-xl bg-mosque-green/10 p-6 ring-1 ring-mosque-green/20">
      <span className="text-sm font-medium uppercase tracking-widest text-mosque-green/80">
        Next Prayer
      </span>
      <span className="text-2xl font-bold text-mosque-green">
        {nextPrayer.prayer.name}
        <span className="font-noto-naskh ml-2 text-lg" dir="rtl">
          {nextPrayer.prayer.nameArabic}
        </span>
      </span>
      <span className="font-mono text-5xl font-bold tabular-nums text-foreground">
        {formatCountdown(
          nextPrayer.countdown.hours,
          nextPrayer.countdown.minutes,
          nextPrayer.countdown.seconds
        )}
      </span>
    </div>
  );
}
