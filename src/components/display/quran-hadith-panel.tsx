"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface QuranHadithItem {
  id: string;
  type: "QURAN" | "HADITH";
  textArabic: string;
  textTranslation: string;
  reference: string;
}

interface QuranHadithPanelProps {
  items: QuranHadithItem[];
  rotationInterval?: number;
}

export function QuranHadithPanel({
  items,
  rotationInterval = 15,
}: QuranHadithPanelProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const advance = useCallback(() => {
    if (items.length <= 1) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
      setIsTransitioning(false);
    }, 400);
  }, [items.length]);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(advance, rotationInterval * 1000);
    return () => clearInterval(timer);
  }, [advance, rotationInterval, items.length]);

  if (items.length === 0) {
    return (
      <Card className="border-mosque-gold/20 bg-card/60 backdrop-blur h-full">
        <CardContent className="flex h-full items-center justify-center py-8">
          <p className="text-muted-foreground">No content available</p>
        </CardContent>
      </Card>
    );
  }

  const current = items[currentIndex];
  const isQuran = current.type === "QURAN";

  return (
    <Card className="border-mosque-gold/20 bg-card/60 backdrop-blur h-full">
      <CardContent className="flex h-full flex-col justify-between py-8 px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-semibold uppercase tracking-widest text-mosque-gold bg-mosque-gold/10 px-4 py-2 rounded">
            {isQuran ? "Quran" : "Hadith"}
          </span>
          {items.length > 1 && (
            <span className="text-lg text-muted-foreground">
              {currentIndex + 1} / {items.length}
            </span>
          )}
        </div>

        {/* Content */}
        <div
          className={`flex-1 flex flex-col justify-center space-y-8 transition-opacity duration-400 ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
        >
          {/* Arabic Text */}
          <p
            className="font-amiri text-5xl leading-relaxed text-foreground text-center"
            dir="rtl"
            lang="ar"
          >
            {current.textArabic}
          </p>

          {/* Divider */}
          <div className="mx-auto h-px w-32 bg-mosque-gold/40" />

          {/* Translation */}
          <p className="text-2xl leading-relaxed text-muted-foreground italic text-center max-w-4xl mx-auto">
            &ldquo;{current.textTranslation}&rdquo;
          </p>

          {/* Reference */}
          <p className="text-center text-lg font-medium text-mosque-gold">
            — {current.reference}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
