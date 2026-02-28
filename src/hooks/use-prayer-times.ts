"use client";

import { useState, useEffect, useCallback } from "react";
import type { PrayerTimesApiResponse } from "@/types/prayer-times";

export function usePrayerTimes(slug: string, refreshInterval: number = 900000) {
  const [data, setData] = useState<PrayerTimesApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(`/api/prayer-times/${slug}`);
      if (!response.ok) throw new Error("Failed to fetch prayer times");
      const json = await response.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchData, refreshInterval]);

  return { data, loading, error, refetch: fetchData };
}
