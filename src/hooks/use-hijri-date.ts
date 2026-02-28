"use client";

import { useMemo } from "react";
import { useCurrentTime } from "./use-current-time";
import { getHijriDate, getHijriDateArabic } from "@/lib/date-utils";

export function useHijriDate(timezone?: string) {
  const currentTime = useCurrentTime(60000);

  const hijriDate = useMemo(() => getHijriDate(currentTime, "en-US", timezone), [currentTime, timezone]);
  const hijriDateArabic = useMemo(() => getHijriDateArabic(currentTime, timezone), [currentTime, timezone]);

  return { hijriDate, hijriDateArabic };
}
