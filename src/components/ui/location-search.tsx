"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LocationResult {
  displayName: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

interface LocationSearchProps {
  onSelect: (result: LocationResult) => void;
  defaultValue?: string;
  placeholder?: string;
}

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    county?: string;
    state?: string;
    country?: string;
  };
}

function extractCity(address: NominatimResult["address"]): string {
  if (!address) return "";
  return (
    address.city ||
    address.town ||
    address.village ||
    address.municipality ||
    address.county ||
    ""
  );
}

export function LocationSearch({
  onSelect,
  defaultValue = "",
  placeholder = "Search place, e.g. Tambak, Banyumas",
}: LocationSearchProps) {
  const [query, setQuery] = useState(defaultValue);
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchPlaces = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 3) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&addressdetails=1&limit=5`,
        { headers: { "Accept-Language": "en" } }
      );
      if (res.ok) {
        const data: NominatimResult[] = await res.json();
        setResults(data);
        setIsOpen(data.length > 0);
      }
    } catch {
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  function handleInputChange(value: string) {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchPlaces(value), 400);
  }

  function handleSelect(result: NominatimResult) {
    const city = extractCity(result.address);
    const country = result.address?.country || "";
    const displayName = [city, result.address?.state, country]
      .filter(Boolean)
      .join(", ");

    setQuery(displayName || result.display_name);
    setIsOpen(false);
    setResults([]);

    onSelect({
      displayName: result.display_name,
      city,
      country,
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
    });
  }

  async function detectLocation() {
    if (!navigator.geolocation) {
      return;
    }

    setDetecting(true);
    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
          });
        }
      );

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=12&addressdetails=1`,
        { headers: { "Accept-Language": "en" } }
      );

      if (res.ok) {
        const data: NominatimResult = await res.json();
        handleSelect(data);
      } else {
        onSelect({
          displayName: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
          city: "",
          country: "",
          latitude: lat,
          longitude: lng,
        });
        setQuery(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      }
    } catch {
      // Geolocation error - silently fail
    } finally {
      setDetecting(false);
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => results.length > 0 && setIsOpen(true)}
            placeholder={placeholder}
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg
                className="animate-spin h-4 w-4 text-muted-foreground"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            </div>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={detectLocation}
          disabled={detecting}
          title="Detect my location"
          className="shrink-0"
        >
          {detecting ? (
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v4m0 12v4m10-10h-4M6 12H2" />
            </svg>
          )}
        </Button>
      </div>

      {/* Dropdown Results */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg max-h-60 overflow-auto">
          {results.map((result, i) => (
            <button
              key={`${result.lat}-${result.lon}-${i}`}
              type="button"
              className="w-full px-3 py-2.5 text-left text-sm hover:bg-accent transition-colors border-b last:border-b-0 border-border/50"
              onClick={() => handleSelect(result)}
            >
              <div className="font-medium truncate">
                {extractCity(result.address) || result.display_name.split(",")[0]}
                {result.address?.state && (
                  <span className="text-muted-foreground font-normal">
                    , {result.address.state}
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground truncate mt-0.5">
                {result.display_name}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
