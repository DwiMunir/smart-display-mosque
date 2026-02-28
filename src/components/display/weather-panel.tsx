"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface WeatherData {
  location: string;
  tempC: number;
  tempF: number;
  condition: string;
  icon: string;
  humidity: number;
  windKph: number;
  feelsLikeC: number;
  feelsLikeF: number;
}

interface WeatherPanelProps {
  weather: WeatherData | null;
  unit?: string;
}

export function WeatherPanel({ weather, unit = "metric" }: WeatherPanelProps) {
  if (!weather) {
    return (
      <Card className="border-border/30 bg-card/60 backdrop-blur">
        <CardContent className="flex items-center justify-center py-6">
          <p className="text-sm text-muted-foreground">Weather unavailable</p>
        </CardContent>
      </Card>
    );
  }

  const temp = unit === "imperial" ? weather.tempF : weather.tempC;
  const feelsLike =
    unit === "imperial" ? weather.feelsLikeF : weather.feelsLikeC;
  const unitLabel = unit === "imperial" ? "°F" : "°C";

  return (
    <Card className="border-border/30 bg-card/60 backdrop-blur">
      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold tabular-nums text-foreground">
                {Math.round(temp)}
              </span>
              <span className="text-lg text-muted-foreground">{unitLabel}</span>
            </div>
            <p className="text-sm font-medium text-foreground mt-1">
              {weather.condition}
            </p>
            <div className="mt-2 flex gap-3 text-xs text-muted-foreground">
              <span>Feels {Math.round(feelsLike)}{unitLabel}</span>
              <span>💧 {weather.humidity}%</span>
              <span>💨 {Math.round(weather.windKph)} km/h</span>
            </div>
          </div>
          {weather.icon && (
            <Image
              src={weather.icon}
              alt={weather.condition}
              width={64}
              height={64}
              className="h-16 w-16"
              unoptimized
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
