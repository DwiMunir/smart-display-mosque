"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { useCurrentTime } from "@/hooks/use-current-time";
import { useHijriDate } from "@/hooks/use-hijri-date";
import { formatCountdown } from "@/lib/date-utils";

interface WeatherData {
  location: string;
  tempC: number;
  tempF: number;
  condition: string;
  icon: string;
  humidity: number;
  windKph: number;
  feelsLikeC: number;
  feelsLikeF: number;
}

interface DateTimePanelProps {
  timezone: string;
  showHijriDate: boolean;
  showGregorianDate: boolean;
  clockFormat: string;
  showClock?: boolean;
  showCountdown?: boolean;
  nextPrayer: { name: string; nameArabic: string; time: string } | null;
  countdown: { hours: number; minutes: number; seconds: number } | null;
  weather: WeatherData | null;
  weatherUnit: string;
  location?: string;
}

export function DateTimePanel({
  timezone,
  showHijriDate,
  showGregorianDate,
  clockFormat,
  showClock = true,
  showCountdown = true,
  nextPrayer,
  countdown,
  weather,
  weatherUnit,
  location,
}: DateTimePanelProps) {
  const currentTime = useCurrentTime();
  const { hijriDate, hijriDateArabic } = useHijriDate(timezone);

  const is24h = clockFormat === "24h";
  const timeStr = currentTime.toLocaleTimeString("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: !is24h,
  });

  const gregorianDate = currentTime.toLocaleDateString("en-US", {
    timeZone: timezone,
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const temp = weatherUnit === "imperial" ? weather?.tempF : weather?.tempC;
  const unitLabel = weatherUnit === "imperial" ? "F" : "C";

  return (
    <Card className="h-full border-border/30 bg-card/60 backdrop-blur">
      <CardContent className="flex h-full flex-col items-center justify-between py-6">
        {/* Date Section */}
        <div className="text-center space-y-2">
          {showHijriDate && (
            <>
              <p className="text-lg font-semibold text-mosque-gold uppercase tracking-wider">
                {hijriDate}
              </p>
              <p className="font-noto-naskh text-base text-mosque-gold/80" dir="rtl">
                {hijriDateArabic}
              </p>
            </>
          )}
          {showGregorianDate && (
            <p className="text-base text-muted-foreground uppercase tracking-wider">
              {gregorianDate}
            </p>
          )}
        </div>

        {/* Clock Section */}
        {showClock && (
          <div className="flex flex-col items-center gap-1">
            <span className="font-mono text-7xl font-bold tabular-nums text-foreground">
              {is24h ? timeStr : timeStr.split(" ")[0]}
            </span>
            {!is24h && (
              <span className="text-3xl font-medium text-muted-foreground">
                {timeStr.split(" ")[1]}
              </span>
            )}
          </div>
        )}

        {/* Countdown Section */}
        {showCountdown && nextPrayer && countdown && (
          <div className="flex flex-col items-center gap-2 rounded-xl bg-mosque-green/10 px-8 py-5 ring-1 ring-mosque-green/20">
            <span className="text-base font-medium uppercase tracking-widest text-mosque-green/80">
              Next Athan
            </span>
            <span className="text-2xl font-semibold text-mosque-green">
              {nextPrayer.name}
            </span>
            <span className="font-mono text-5xl font-bold tabular-nums text-foreground">
              {formatCountdown(countdown.hours, countdown.minutes, countdown.seconds)}
            </span>
          </div>
        )}

        {/* Weather & Location Section */}
        <div className="flex flex-col items-center gap-3">
          {weather && (
            <div className="flex items-center gap-4 rounded-lg bg-muted/30 px-6 py-3">
              {weather.icon && (
                <Image
                  src={weather.icon}
                  alt={weather.condition}
                  width={56}
                  height={56}
                  className="h-14 w-14"
                  unoptimized
                />
              )}
              <div className="text-center">
                <span className="text-4xl font-bold tabular-nums text-foreground">
                  {Math.round(temp || 0)}
                </span>
                <span className="text-xl text-muted-foreground">°{unitLabel}</span>
              </div>
            </div>
          )}
          {location && (
            <div className="flex items-center gap-2 text-base text-muted-foreground">
              <svg
                className="h-5 w-5 text-mosque-green"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>{location}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
