export interface MosqueData {
  id: string;
  slug: string;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
  calculationMethod: number;
  isActive: boolean;
}

export interface MosqueWithSettings extends MosqueData {
  displaySettings: DisplaySettingsData | null;
}

export interface DisplaySettingsData {
  id: string;
  theme: string;
  primaryColor: string;
  showHijriDate: boolean;
  showGregorianDate: boolean;
  announcementDuration: number;
  quranVerseRotation: string;
}
