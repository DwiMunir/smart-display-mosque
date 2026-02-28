"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LocationSearch } from "@/components/ui/location-search";
import { toast } from "sonner";

interface SettingsFormProps {
  mosque: {
    name: string;
    slug: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    timezone: string;
    logoUrl?: string | null;
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
  } | null;
}

const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Europe/Istanbul",
  "Asia/Dubai",
  "Asia/Riyadh",
  "Asia/Karachi",
  "Asia/Kolkata",
  "Asia/Dhaka",
  "Asia/Jakarta",
  "Asia/Kuala_Lumpur",
  "Asia/Tokyo",
  "Africa/Cairo",
  "Africa/Casablanca",
  "Australia/Sydney",
];

export function SettingsForm({ mosque, displaySettings }: SettingsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(mosque.name);
  const [city, setCity] = useState(mosque.city);
  const [country, setCountry] = useState(mosque.country);
  const [latitude, setLatitude] = useState(mosque.latitude);
  const [longitude, setLongitude] = useState(mosque.longitude);
  const [timezone, setTimezone] = useState(mosque.timezone);
  const [logoUrl, setLogoUrl] = useState(mosque.logoUrl || "");

  const ds = displaySettings || {
    theme: "dark",
    primaryColor: "#10b981",
    secondaryColor: "#3b82f6",
    showHijriDate: true,
    showGregorianDate: true,
    clockFormat: "12h",
    announcementDuration: 10,
    transitionEffect: "fade",
    mediaInterval: 10,
    infoDuration: 30,
  };

  const [theme, setTheme] = useState(ds.theme);
  const [primaryColor, setPrimaryColor] = useState(ds.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(ds.secondaryColor);
  const [showHijriDate, setShowHijriDate] = useState(ds.showHijriDate);
  const [showGregorianDate, setShowGregorianDate] = useState(ds.showGregorianDate);
  const [clockFormat, setClockFormat] = useState(ds.clockFormat);
  const [announcementDuration, setAnnouncementDuration] = useState(
    String(ds.announcementDuration)
  );
  const [transitionEffect, setTransitionEffect] = useState(ds.transitionEffect);
  const [mediaInterval, setMediaInterval] = useState(String(ds.mediaInterval));
  const [infoDuration, setInfoDuration] = useState(String(ds.infoDuration));

  const locationDefault = [city, country].filter(Boolean).join(", ");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mosque: {
            name,
            city,
            country,
            latitude,
            longitude,
            timezone,
            logoUrl: logoUrl || null,
          },
          displaySettings: {
            theme,
            primaryColor,
            secondaryColor,
            showHijriDate,
            showGregorianDate,
            clockFormat,
            announcementDuration: parseInt(announcementDuration) || 10,
            transitionEffect,
            mediaInterval: parseInt(mediaInterval) || 10,
            infoDuration: parseInt(infoDuration) || 30,
          },
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Settings saved");
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
          <CardTitle>Mosque Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Timezone</Label>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((tz) => (
                  <SelectItem key={tz} value={tz}>
                    {tz}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location Search */}
          <div className="space-y-2 sm:col-span-2">
            <Label>Location</Label>
            <LocationSearch
              defaultValue={locationDefault}
              placeholder="Search place, e.g. Tambak, Banyumas"
              onSelect={(result) => {
                setCity(result.city);
                setCountry(result.country);
                setLatitude(result.latitude);
                setLongitude(result.longitude);
              }}
            />
            <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
              <span>
                Lat: <strong className="text-foreground">{latitude.toFixed(4)}</strong>
              </span>
              <span>
                Lng: <strong className="text-foreground">{longitude.toFixed(4)}</strong>
              </span>
              {city && (
                <span>
                  City: <strong className="text-foreground">{city}</strong>
                </span>
              )}
              {country && (
                <span>
                  Country: <strong className="text-foreground">{country}</strong>
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="logoUrl">Logo URL</Label>
            <Input
              id="logoUrl"
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://example.com/logo.png"
            />
            <p className="text-xs text-muted-foreground">
              URL to your mosque logo image (recommended: 300x300px, PNG or JPG)
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Display Appearance</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Theme</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dark">Dark (recommended for TV)</SelectItem>
                <SelectItem value="light">Light</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Transition Effect</Label>
            <Select value={transitionEffect} onValueChange={setTransitionEffect}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fade">Fade</SelectItem>
                <SelectItem value="slide">Slide</SelectItem>
                <SelectItem value="zoom">Zoom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Clock Format</Label>
            <Select value={clockFormat} onValueChange={setClockFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                <SelectItem value="24h">24-hour</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Primary Color</Label>
            <div className="flex gap-2">
              <Input
                id="primaryColor"
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="h-10 w-14 p-1"
              />
              <Input
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="secondaryColor">Secondary Color</Label>
            <div className="flex gap-2">
              <Input
                id="secondaryColor"
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="h-10 w-14 p-1"
              />
              <Input
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Display Behavior</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="infoDuration">Info Screen Duration (sec)</Label>
              <Input
                id="infoDuration"
                type="number"
                min={10}
                max={300}
                value={infoDuration}
                onChange={(e) => setInfoDuration(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                How long to show info before media
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mediaInterval">Media Slide Duration (sec)</Label>
              <Input
                id="mediaInterval"
                type="number"
                min={3}
                max={120}
                value={mediaInterval}
                onChange={(e) => setMediaInterval(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Default time per media item
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="announcementDuration">
                Announcement Rotate (sec)
              </Label>
              <Input
                id="announcementDuration"
                type="number"
                min={3}
                max={60}
                value={announcementDuration}
                onChange={(e) => setAnnouncementDuration(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <Switch checked={showHijriDate} onCheckedChange={setShowHijriDate} />
              <Label>Show Hijri Date</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={showGregorianDate}
                onCheckedChange={setShowGregorianDate}
              />
              <Label>Show Gregorian Date</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={loading} size="lg">
        {loading ? "Saving..." : "Save All Settings"}
      </Button>
    </form>
  );
}
