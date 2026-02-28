"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTime12h } from "@/lib/date-utils";
import type { PrayerTimeData } from "@/types/prayer-times";

interface PrayerTimesCardProps {
  prayers: PrayerTimeData[];
  mosqueName?: string;
}

export function PrayerTimesCard({ prayers, mosqueName }: PrayerTimesCardProps) {
  return (
    <Card className="border-mosque-green/20 bg-card/80 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="text-center text-lg font-semibold tracking-wide uppercase text-mosque-green">
          {mosqueName ? `${mosqueName} - Prayer Times` : "Prayer Times"}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="space-y-1">
          {prayers.map((prayer) => (
            <div
              key={prayer.name}
              className={`flex items-center justify-between rounded-lg px-4 py-3 transition-colors ${
                prayer.isNext
                  ? "bg-mosque-green/15 ring-1 ring-mosque-green/30"
                  : "hover:bg-muted/50"
              }`}
            >
              <div className="flex items-center gap-3">
                {prayer.isNext && (
                  <span className="h-2 w-2 rounded-full bg-mosque-green animate-pulse" />
                )}
                <span
                  className={`text-base font-medium ${
                    prayer.isNext ? "text-mosque-green" : "text-foreground"
                  }`}
                >
                  {prayer.name}
                </span>
                <span
                  className="font-noto-naskh text-sm text-muted-foreground"
                  dir="rtl"
                >
                  {prayer.nameArabic}
                </span>
              </div>
              <span
                className={`text-lg font-mono tabular-nums ${
                  prayer.isNext
                    ? "text-mosque-green font-bold"
                    : "text-foreground"
                }`}
              >
                {formatTime12h(prayer.time)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
