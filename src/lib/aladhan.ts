export interface PrayerTimesResponse {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  date: {
    readable: string;
    hijri: {
      date: string;
      day: string;
      month: { number: number; en: string; ar: string };
      year: string;
    };
  };
}

interface AladhanTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

interface AladhanDate {
  readable: string;
  hijri: {
    date: string;
    day: string;
    month: { number: number; en: string; ar: string };
    year: string;
  };
}

interface AladhanApiResponse {
  code: number;
  status: string;
  data: {
    timings: AladhanTimings;
    date: AladhanDate;
  };
}

const ALADHAN_API = process.env.NEXT_PUBLIC_ALADHAN_API || "https://api.aladhan.com/v1";

function cleanTime(time: string): string {
  return time.replace(/\s*\(.*\)/, "").trim();
}

export async function fetchPrayerTimes(
  latitude: number,
  longitude: number,
  method: number = 2,
  date?: string
): Promise<PrayerTimesResponse> {
  const dateParam = date || new Date().toISOString().split("T")[0];
  const [year, month, day] = dateParam.split("-");

  const url = `${ALADHAN_API}/timings/${day}-${month}-${year}?latitude=${latitude}&longitude=${longitude}&method=${method}`;

  const response = await fetch(url, { next: { revalidate: 900 } });

  if (!response.ok) {
    throw new Error(`Aladhan API error: ${response.status}`);
  }

  const json: AladhanApiResponse = await response.json();

  if (json.code !== 200) {
    throw new Error(`Aladhan API returned code ${json.code}`);
  }

  const { timings, date: dateInfo } = json.data;

  return {
    fajr: cleanTime(timings.Fajr),
    sunrise: cleanTime(timings.Sunrise),
    dhuhr: cleanTime(timings.Dhuhr),
    asr: cleanTime(timings.Asr),
    maghrib: cleanTime(timings.Maghrib),
    isha: cleanTime(timings.Isha),
    date: dateInfo,
  };
}

export function getMockPrayerTimes(): PrayerTimesResponse {
  return {
    fajr: "05:30",
    sunrise: "06:45",
    dhuhr: "12:15",
    asr: "15:30",
    maghrib: "18:15",
    isha: "19:45",
    date: {
      readable: new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      hijri: {
        date: "01-09-1447",
        day: "1",
        month: { number: 9, en: "Ramadan", ar: "رَمَضان" },
        year: "1447",
      },
    },
  };
}
