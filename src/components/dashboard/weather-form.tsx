"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

interface WeatherFormProps {
  settings: {
    location: string;
    unit: string;
  } | null;
}

export function WeatherForm({ settings }: WeatherFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(settings?.location || "");
  const [unit, setUnit] = useState(settings?.unit || "metric");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/weather", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location, unit }),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Weather settings saved");
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
          <CardTitle>Weather Location</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>City or Location</Label>
            <LocationSearch
              defaultValue={location}
              placeholder="Search place, e.g. Tambak, Banyumas"
              onSelect={(result) => {
                // Use lat,lng for precise weather data
                setLocation(`${result.latitude},${result.longitude}`);
              }}
            />
            <p className="text-xs text-muted-foreground">
              Search a place or click the GPS button to auto-detect. Uses exact
              coordinates for the most accurate weather data.
            </p>
          </div>
          <div className="space-y-2">
            <Label>Temperature Unit</Label>
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metric">Celsius (°C)</SelectItem>
                <SelectItem value="imperial">Fahrenheit (°F)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Weather Settings"}
      </Button>
    </form>
  );
}
