"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { QuranVerseData } from "@/types/display-settings";

interface QuranVerseDisplayProps {
  verse: QuranVerseData | null;
}

export function QuranVerseDisplay({ verse }: QuranVerseDisplayProps) {
  if (!verse) {
    return (
      <Card className="border-mosque-gold/20 bg-card/80 backdrop-blur">
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading verse...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-mosque-gold/20 bg-card/80 backdrop-blur">
      <CardContent className="space-y-4 py-6">
        <div className="text-center">
          <p
            className="font-amiri text-3xl leading-loose text-foreground"
            dir="rtl"
            lang="ar"
          >
            {verse.textArabic}
          </p>
        </div>

        <div className="mx-auto h-px w-24 bg-mosque-gold/30" />

        <div className="text-center">
          <p className="text-base leading-relaxed text-muted-foreground italic">
            &ldquo;{verse.textTranslation}&rdquo;
          </p>
        </div>

        <p className="text-center text-sm font-medium text-mosque-gold">
          Surah {verse.surahNameEnglish} ({verse.surahNameArabic}) - Verse{" "}
          {verse.verseNumber}
        </p>
      </CardContent>
    </Card>
  );
}
