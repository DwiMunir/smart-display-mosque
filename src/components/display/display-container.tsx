"use client";

import { useState, useEffect, useCallback } from "react";
import { MosqueBrandingPanel } from "@/components/display/mosque-branding-panel";
import { QuranHadithPanel } from "@/components/display/quran-hadith-panel";
import { DateTimePanel } from "@/components/display/date-time-panel";
import { PrayerTimesBar } from "@/components/display/prayer-times-bar";
import { AnnouncementsTicker } from "@/components/display/announcements-ticker";
import { MediaCarousel } from "@/components/display/media-carousel";

interface DisplayData {
  mosque: {
    name: string;
    slug: string;
    timezone: string;
    logoUrl?: string | null;
    city: string;
    country: string;
  };
  displaySettings: {
    theme: string;
    primaryColor: string;
    secondaryColor: string;
    showHijriDate: boolean;
    showGregorianDate: boolean;
    clockFormat: string;
    announcementDuration: number;
    transitionEffect: string;
    mediaInterval: number;
    infoDuration: number;
    showPrayerTimes: boolean;
    showAnnouncements: boolean;
    showWeather: boolean;
    showDonations: boolean;
    showQuranHadith: boolean;
    showClock: boolean;
    showCountdown: boolean;
    showLocation: boolean;
    showLogo: boolean;
    marqueeSpeed: number;
  };
  weatherSettings: {
    unit: string;
  };
  prayerTimes: {
    prayers: {
      name: string;
      nameArabic: string;
      time: string;
      iqamahTime?: string;
      isNext: boolean;
    }[];
    nextPrayer: { name: string; nameArabic: string; time: string } | null;
    countdown: { hours: number; minutes: number; seconds: number } | null;
    hijriDate: string | null;
    gregorianDate: string;
  };
  weather: {
    location: string;
    tempC: number;
    tempF: number;
    condition: string;
    icon: string;
    humidity: number;
    windKph: number;
    feelsLikeC: number;
    feelsLikeF: number;
  } | null;
  quranHadith: {
    id: string;
    type: "QURAN" | "HADITH";
    textArabic: string;
    textTranslation: string;
    reference: string;
  }[];
  donations: {
    id: string;
    title: string;
    description: string | null;
    qrCodeUrl: string | null;
    targetAmount: number | null;
    currentAmount: number;
    currency: string;
  }[];
  media: {
    id: string;
    type: "IMAGE" | "VIDEO";
    url: string;
    title: string | null;
    duration: number;
  }[];
  announcements: {
    id: string;
    title: string;
    content: string;
    priority: string;
  }[];
}

interface DisplayContainerProps {
  initialData: DisplayData;
  slug: string;
}

export function DisplayContainer({ initialData, slug }: DisplayContainerProps) {
  const [data, setData] = useState<DisplayData>(initialData);
  const [mode, setMode] = useState<"info" | "media">("info");

  // Poll for data updates every 5s for near real-time sync
  const refreshData = useCallback(async () => {
    try {
      const res = await fetch(`/api/display/${slug}`);
      if (res.ok) {
        const newData = await res.json();
        setData(newData);
      }
    } catch {
      // Silent fail, keep showing last data
    }
  }, [slug]);

  useEffect(() => {
    const interval = setInterval(refreshData, 5000);
    return () => clearInterval(interval);
  }, [refreshData]);

  // Media carousel timer: after infoDuration on info screen, switch to media
  useEffect(() => {
    if (mode !== "info") return;
    if (!data.media || data.media.length === 0) return;

    const timer = setTimeout(
      () => {
        setMode("media");
      },
      (data.displaySettings.infoDuration || 30) * 1000,
    );

    return () => clearTimeout(timer);
  }, [mode, data.media, data.displaySettings.infoDuration]);

  // Prevent screen sleep
  useEffect(() => {
    const interval = setInterval(() => {
      document.title = `${data.mosque.name} - Display`;
    }, 30000);
    return () => clearInterval(interval);
  }, [data.mosque.name]);

  // Auto fullscreen on first user interaction
  useEffect(() => {
    const requestFullscreen = async () => {
      try {
        if (document.fullscreenElement) return;
        await document.documentElement.requestFullscreen();
      } catch {
        // Fullscreen not supported or denied
      }
    };

    const handleInteraction = () => {
      requestFullscreen();
      // Remove listeners after first successful interaction
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
    };

    // Add event listeners for user interaction
    document.addEventListener("click", handleInteraction);
    document.addEventListener("keydown", handleInteraction);
    document.addEventListener("touchstart", handleInteraction);

    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
    };
  }, []);

  const handleMediaComplete = useCallback(() => {
    setMode("info");
  }, []);

  const settings = data.displaySettings;
  const timezone = data.mosque.timezone;
  const weatherUnit = data.weatherSettings?.unit || "metric";
  const isDark = settings.theme !== "light";

  return (
    <div
      className={`${isDark ? "dark" : ""} relative flex h-screen w-screen flex-col overflow-hidden`}
      style={
        {
          "--mosque-green": settings.primaryColor,
          "--mosque-gold": settings.secondaryColor,
        } as React.CSSProperties
      }
    >
      {/* Animated Background */}
      {isDark ? (
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#0d1f35] to-[#0a1628]">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-mosque-green/30 to-transparent animate-float-slow animate-pulse-glow" />
          <div
            className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-mosque-gold/20 to-transparent animate-float-medium animate-pulse-glow"
            style={{ animationDelay: "-5s" }}
          />
          <div
            className="absolute top-[40%] right-[20%] w-[400px] h-[400px] rounded-full bg-gradient-to-bl from-blue-500/15 to-transparent animate-float-slow animate-pulse-glow"
            style={{ animationDelay: "-10s" }}
          />
          <div
            className="absolute bottom-[30%] left-[10%] w-[350px] h-[350px] rounded-full bg-gradient-to-tr from-mosque-green/20 to-transparent animate-float-medium animate-pulse-glow"
            style={{ animationDelay: "-3s" }}
          />
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          />
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-mosque-green/10 to-transparent" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-mosque-green/10 to-transparent animate-float-slow animate-pulse-glow" />
          <div
            className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-mosque-gold/10 to-transparent animate-float-medium animate-pulse-glow"
            style={{ animationDelay: "-5s" }}
          />
          <div
            className="absolute top-[40%] right-[20%] w-[400px] h-[400px] rounded-full bg-gradient-to-bl from-blue-200/20 to-transparent animate-float-slow animate-pulse-glow"
            style={{ animationDelay: "-10s" }}
          />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          />
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-mosque-green/5 to-transparent" />
        </div>
      )}

      {/* Media Carousel Overlay */}
      {mode === "media" && data.media.length > 0 && (
        <MediaCarousel
          media={data.media}
          transitionEffect={
            settings.transitionEffect as "fade" | "slide" | "zoom"
          }
          defaultDuration={settings.mediaInterval || 10}
          onComplete={handleMediaComplete}
        />
      )}

      {/* Main Content - 3 Panel Layout */}
      <div className="relative flex-1 grid grid-cols-[350px_1fr_320px] gap-4 p-4 overflow-hidden z-10">
        {/* Left Panel: Mosque Branding & Donation */}
        <MosqueBrandingPanel
          mosqueName={data.mosque.name}
          logoUrl={settings.showLogo !== false ? data.mosque.logoUrl : null}
          donations={settings.showDonations !== false ? data.donations : []}
        />

        {/* Center Panel: Quran/Hadith */}
        {settings.showQuranHadith !== false && (
          <div className="flex flex-col overflow-hidden">
            <QuranHadithPanel
              items={data.quranHadith}
              rotationInterval={settings.announcementDuration || 15}
            />
          </div>
        )}

        {/* Right Panel: Date, Time, Countdown, Weather, Location */}
        <DateTimePanel
          timezone={timezone}
          showHijriDate={settings.showHijriDate}
          showGregorianDate={settings.showGregorianDate}
          clockFormat={settings.clockFormat || "12h"}
          showClock={settings.showClock !== false}
          showCountdown={settings.showCountdown !== false}
          nextPrayer={data.prayerTimes?.nextPrayer || null}
          countdown={data.prayerTimes?.countdown || null}
          weather={settings.showWeather !== false ? data.weather : null}
          weatherUnit={weatherUnit}
          location={
            settings.showLocation !== false
              ? `${data.mosque.city}, ${data.mosque.country}`
              : undefined
          }
        />
      </div>

      {/* Prayer Times Bar */}
      {settings.showPrayerTimes !== false && (
        <div className="relative z-10 mb-4 px-4">
          {data.prayerTimes && (
            <PrayerTimesBar prayers={data.prayerTimes.prayers} />
          )}
        </div>
      )}

      {/* Bottom Ticker */}
      {settings.showAnnouncements !== false && (
        <div className="relative shrink-0 px-4 pb-3 z-10">
          <AnnouncementsTicker
            announcements={data.announcements}
            speed={settings.marqueeSpeed || 25}
          />
        </div>
      )}
    </div>
  );
}
