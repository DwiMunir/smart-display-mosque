"use client";

import { useHijriDate } from "@/hooks/use-hijri-date";
import { useCurrentTime } from "@/hooks/use-current-time";

interface HijriDateDisplayProps {
  showHijri?: boolean;
  showGregorian?: boolean;
  timezone?: string;
}

export function HijriDateDisplay({
  showHijri = true,
  showGregorian = true,
  timezone,
}: HijriDateDisplayProps) {
  const { hijriDate, hijriDateArabic } = useHijriDate(timezone);
  const currentTime = useCurrentTime(60000);

  const gregorianDate = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    ...(timezone ? { timeZone: timezone } : {}),
  });

  return (
    <div className="flex flex-col items-center gap-1 text-center">
      {showHijri && (
        <>
          <p className="text-lg font-semibold text-mosque-gold">{hijriDate}</p>
          <p className="font-noto-naskh text-base text-mosque-gold/80" dir="rtl">
            {hijriDateArabic}
          </p>
        </>
      )}
      {showGregorian && (
        <p className="text-sm text-muted-foreground">{gregorianDate}</p>
      )}
    </div>
  );
}
