"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AnnouncementData } from "@/types/announcement";

interface AnnouncementsCarouselProps {
  announcements: AnnouncementData[];
  duration?: number;
}

const priorityStyles: Record<string, string> = {
  urgent: "bg-red-500/20 text-red-400 border-red-500/30",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  medium: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  low: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

export function AnnouncementsCarousel({
  announcements,
  duration = 10,
}: AnnouncementsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const advance = useCallback(() => {
    if (announcements.length <= 1) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
      setIsTransitioning(false);
    }, 300);
  }, [announcements.length]);

  useEffect(() => {
    if (announcements.length <= 1) return;
    const timer = setInterval(advance, duration * 1000);
    return () => clearInterval(timer);
  }, [advance, duration, announcements.length]);

  if (announcements.length === 0) {
    return (
      <Card className="border-border/50 bg-card/80 backdrop-blur">
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">No announcements at this time</p>
        </CardContent>
      </Card>
    );
  }

  const current = announcements[currentIndex];

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur">
      <CardContent className="py-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Announcements
          </h3>
          {announcements.length > 1 && (
            <span className="text-xs text-muted-foreground">
              {currentIndex + 1} / {announcements.length}
            </span>
          )}
        </div>

        <div
          className={`transition-opacity duration-300 ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <h4 className="text-xl font-semibold text-foreground">
              {current.title}
            </h4>
            <Badge
              variant="outline"
              className={priorityStyles[current.priority] || priorityStyles.medium}
            >
              {current.priority}
            </Badge>
          </div>
          <p className="text-base leading-relaxed text-muted-foreground">
            {current.content}
          </p>
        </div>

        {announcements.length > 1 && (
          <div className="mt-4 flex justify-center gap-1.5">
            {announcements.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentIndex
                    ? "w-6 bg-mosque-green"
                    : "w-1.5 bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
