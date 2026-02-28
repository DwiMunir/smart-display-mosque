export function getHijriDate(date: Date = new Date(), locale: string = "en-US", timeZone?: string): string {
  try {
    const options: Intl.DateTimeFormatOptions = {
      calendar: "islamic-umalqura",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    if (timeZone) options.timeZone = timeZone;
    const formatter = new Intl.DateTimeFormat(locale, options);
    return formatter.format(date);
  } catch {
    return "";
  }
}

export function getHijriDateArabic(date: Date = new Date(), timeZone?: string): string {
  try {
    const options: Intl.DateTimeFormatOptions = {
      calendar: "islamic-umalqura",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    if (timeZone) options.timeZone = timeZone;
    const formatter = new Intl.DateTimeFormat("ar-SA", options);
    return formatter.format(date);
  } catch {
    return "";
  }
}

export function formatTime12h(time24: string): string {
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12;
  return `${hours12}:${String(minutes).padStart(2, "0")} ${period}`;
}

export function getDayOfYear(date: Date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

export function formatCountdown(hours: number, minutes: number, seconds: number): string {
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
