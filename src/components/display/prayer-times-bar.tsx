"use client";

import { formatTime12h } from "@/lib/date-utils";

interface PrayerData {
  name: string;
  nameArabic: string;
  time: string;
  iqamahTime?: string;
  isNext: boolean;
}

interface PrayerTimesBarProps {
  prayers: PrayerData[];
}

export function PrayerTimesBar({ prayers }: PrayerTimesBarProps) {
  return (
    <div className="w-full bg-card/80 backdrop-blur border-t border-border/30">
      <div className="grid grid-cols-5 divide-x divide-border/30">
        {prayers.map((prayer) => (
          <div
            key={prayer.name}
            className={`flex flex-col items-center py-5 px-3 transition-colors ${
              prayer.isNext
                ? "bg-mosque-green/15 ring-inset ring-1 ring-mosque-green/30"
                : ""
            }`}
          >
            {/* Prayer Name */}
            <div className="flex items-center gap-2 mb-2">
              {prayer.isNext && (
                <span className="h-3 w-3 rounded-full bg-mosque-green animate-pulse" />
              )}
              <span
                className={`text-xl font-semibold uppercase tracking-wider ${
                  prayer.isNext ? "text-mosque-green" : "text-foreground"
                }`}
              >
                {prayer.name}
              </span>
            </div>

            {/* Arabic Name */}
            <span
              className="font-noto-naskh text-base text-muted-foreground mb-3"
              dir="rtl"
            >
              {prayer.nameArabic}
            </span>

            {/* Athan Time */}
            <span
              className={`font-mono text-3xl font-bold tabular-nums ${
                prayer.isNext ? "text-mosque-green" : "text-foreground"
              }`}
            >
              {formatTime12h(prayer.time)}
            </span>

            {/* Iqamah Time */}
            {prayer.iqamahTime && (
              <div className="flex flex-col items-center mt-2">
                <span className="font-mono text-2xl tabular-nums text-mosque-gold">
                  {formatTime12h(prayer.iqamahTime)}
                </span>
                <span className="text-sm uppercase tracking-wider text-muted-foreground">
                  Iqamah
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
