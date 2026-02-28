"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LocationSearch } from "@/components/ui/location-search";
import { toast } from "sonner";

interface PrayerTimesFormProps {
  mosque: {
    latitude: number;
    longitude: number;
    city: string;
    country: string;
    timezone: string;
    calculationMethod: number;
    asrMethod: number;
    iqamahOffsets: Record<string, number> | null;
  };
}

const CALCULATION_METHODS = [
  { value: "0", label: "Shia Ithna-Ansari" },
  { value: "1", label: "University of Islamic Sciences, Karachi" },
  { value: "2", label: "Islamic Society of North America (ISNA)" },
  { value: "3", label: "Muslim World League" },
  { value: "4", label: "Umm Al-Qura University, Makkah" },
  { value: "5", label: "Egyptian General Authority of Survey" },
  { value: "7", label: "Institute of Geophysics, University of Tehran" },
  { value: "8", label: "Gulf Region" },
  { value: "9", label: "Kuwait" },
  { value: "10", label: "Qatar" },
  { value: "11", label: "Majlis Ugama Islam Singapura, Singapore" },
  { value: "12", label: "UOIF (France)" },
  { value: "13", label: "DIYANET (Turkey)" },
  { value: "14", label: "Spiritual Administration of Muslims of Russia" },
  { value: "15", label: "MOONSIGHTING (Moonsighting Committee)" },
];

const PRAYERS = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;

export function PrayerTimesForm({ mosque }: PrayerTimesFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [latitude, setLatitude] = useState(mosque.latitude);
  const [longitude, setLongitude] = useState(mosque.longitude);
  const [city, setCity] = useState(mosque.city);
  const [country, setCountry] = useState(mosque.country);
  const [calculationMethod, setCalculationMethod] = useState(
    String(mosque.calculationMethod)
  );
  const [asrMethod, setAsrMethod] = useState(String(mosque.asrMethod));
  const [iqamahOffsets, setIqamahOffsets] = useState<Record<string, number>>(
    (mosque.iqamahOffsets as Record<string, number>) || {
      fajr: 15,
      dhuhr: 10,
      asr: 10,
      maghrib: 5,
      isha: 15,
    }
  );

  const locationDefault = [mosque.city, mosque.country]
    .filter(Boolean)
    .join(", ");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mosque: {
            latitude,
            longitude,
            city,
            country,
            calculationMethod: parseInt(calculationMethod),
            asrMethod: parseInt(asrMethod),
            iqamahOffsets,
          },
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Prayer time settings saved");
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
          <CardTitle>Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Search Location</Label>
            <LocationSearch
              defaultValue={locationDefault}
              placeholder="Search mosque location, e.g. Tambak, Banyumas"
              onSelect={(result) => {
                setLatitude(result.latitude);
                setLongitude(result.longitude);
                setCity(result.city);
                setCountry(result.country);
              }}
            />
            <p className="text-xs text-muted-foreground">
              Search a place or use the GPS button to detect automatically.
              Coordinates are used for accurate prayer time calculations.
            </p>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground bg-muted/50 rounded-lg px-4 py-3">
            <div>
              Latitude:{" "}
              <strong className="text-foreground">{latitude.toFixed(6)}</strong>
            </div>
            <div>
              Longitude:{" "}
              <strong className="text-foreground">{longitude.toFixed(6)}</strong>
            </div>
            {city && (
              <div>
                City: <strong className="text-foreground">{city}</strong>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Calculation Method</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Method</Label>
            <Select value={calculationMethod} onValueChange={setCalculationMethod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CALCULATION_METHODS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Asr Calculation</Label>
            <Select value={asrMethod} onValueChange={setAsrMethod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Shafi / Maliki / Hanbali</SelectItem>
                <SelectItem value="1">Hanafi</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Iqamah Offsets (minutes after adhan)</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-5">
          {PRAYERS.map((prayer) => (
            <div key={prayer} className="space-y-2">
              <Label htmlFor={`iqamah-${prayer}`} className="capitalize">
                {prayer}
              </Label>
              <Input
                id={`iqamah-${prayer}`}
                type="number"
                min={0}
                max={120}
                value={iqamahOffsets[prayer] ?? 10}
                onChange={(e) =>
                  setIqamahOffsets((prev) => ({
                    ...prev,
                    [prayer]: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Prayer Time Settings"}
      </Button>
    </form>
  );
}
