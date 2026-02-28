"use client";

import { useCurrentTime } from "@/hooks/use-current-time";

interface DigitalClockProps {
  timezone?: string;
  clockFormat?: string;
}

export function DigitalClock({ timezone = "UTC", clockFormat = "12h" }: DigitalClockProps) {
  const currentTime = useCurrentTime();

  const is24h = clockFormat === "24h";

  const timeStr = currentTime.toLocaleTimeString("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: !is24h,
  });

  if (is24h) {
    return (
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-4xl font-bold tabular-nums text-foreground">
          {timeStr}
        </span>
      </div>
    );
  }

  const [time, period] = timeStr.split(" ");

  return (
    <div className="flex items-baseline gap-2">
      <span className="font-mono text-4xl font-bold tabular-nums text-foreground">
        {time}
      </span>
      <span className="text-lg font-medium text-muted-foreground">{period}</span>
    </div>
  );
}
