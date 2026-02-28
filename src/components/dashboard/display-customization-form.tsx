"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface DisplayCustomizationFormProps {
  settings: {
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
}

const TOGGLE_ITEMS = [
  {
    key: "showPrayerTimes" as const,
    label: "Prayer Times Bar",
    description: "Bottom bar showing all 5 prayer times",
  },
  {
    key: "showClock" as const,
    label: "Clock",
    description: "Current time display on the right panel",
  },
  {
    key: "showCountdown" as const,
    label: "Next Prayer Countdown",
    description: "Countdown timer to the next prayer",
  },
  {
    key: "showWeather" as const,
    label: "Weather",
    description: "Current weather conditions and temperature",
  },
  {
    key: "showLocation" as const,
    label: "Location",
    description: "City and country name below weather",
  },
  {
    key: "showQuranHadith" as const,
    label: "Quran & Hadith",
    description: "Rotating Quran verses and Hadith in center panel",
  },
  {
    key: "showDonations" as const,
    label: "Donations",
    description: "Donation campaigns, QR codes, and progress bars",
  },
  {
    key: "showLogo" as const,
    label: "Mosque Logo",
    description: "Mosque logo on the left panel",
  },
  {
    key: "showAnnouncements" as const,
    label: "Announcements Ticker",
    description: "Scrolling announcements at the bottom",
  },
];

export function DisplayCustomizationForm({
  settings,
}: DisplayCustomizationFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [toggles, setToggles] = useState({
    showPrayerTimes: settings.showPrayerTimes,
    showAnnouncements: settings.showAnnouncements,
    showWeather: settings.showWeather,
    showDonations: settings.showDonations,
    showQuranHadith: settings.showQuranHadith,
    showClock: settings.showClock,
    showCountdown: settings.showCountdown,
    showLocation: settings.showLocation,
    showLogo: settings.showLogo,
  });

  const [marqueeSpeed, setMarqueeSpeed] = useState(
    String(settings.marqueeSpeed)
  );

  function handleToggle(key: keyof typeof toggles, value: boolean) {
    setToggles((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displaySettings: {
            ...toggles,
            marqueeSpeed: parseInt(marqueeSpeed) || 25,
          },
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Display customization saved");
      router.refresh();
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Section Visibility</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {TOGGLE_ITEMS.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="space-y-0.5">
                <Label className="text-base font-medium">{item.label}</Label>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
              <Switch
                checked={toggles[item.key]}
                onCheckedChange={(val) => handleToggle(item.key, val)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Announcements Ticker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="marqueeSpeed">
              Scroll Speed (seconds for one full cycle)
            </Label>
            <div className="flex items-center gap-4">
              <Input
                id="marqueeSpeed"
                type="range"
                min={5}
                max={60}
                step={1}
                value={marqueeSpeed}
                onChange={(e) => setMarqueeSpeed(e.target.value)}
                className="flex-1"
              />
              <span className="w-16 text-center text-sm font-mono tabular-nums">
                {marqueeSpeed}s
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Lower value = faster scrolling. Recommended: 20-30 seconds.
            </p>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={loading} size="lg">
        {loading ? "Saving..." : "Save Display Settings"}
      </Button>
    </form>
  );
}
