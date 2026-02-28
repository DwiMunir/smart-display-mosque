export interface PrayerTimeData {
  name: string;
  nameArabic: string;
  time: string;
  isNext: boolean;
}

export interface PrayerTimesApiResponse {
  prayers: PrayerTimeData[];
  nextPrayer: PrayerTimeData | null;
  countdown: { hours: number; minutes: number; seconds: number } | null;
  hijriDate: string | null;
  gregorianDate: string;
}
