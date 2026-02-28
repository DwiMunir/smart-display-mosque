"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface MediaItem {
  id: string;
  type: "IMAGE" | "VIDEO";
  url: string;
  title: string | null;
  duration: number;
}

interface MediaCarouselProps {
  media: MediaItem[];
  transitionEffect?: "fade" | "slide" | "zoom";
  defaultDuration?: number;
  onComplete: () => void;
}

export function MediaCarousel({
  media,
  transitionEffect = "fade",
  defaultDuration = 10,
  onComplete,
}: MediaCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Fade in on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const advance = useCallback(() => {
    if (currentIndex >= media.length - 1) {
      // Fade out then complete
      setIsVisible(false);
      setTimeout(onComplete, 500);
      return;
    }
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setIsTransitioning(false);
    }, 400);
  }, [currentIndex, media.length, onComplete]);

  useEffect(() => {
    if (media.length === 0) {
      onComplete();
      return;
    }
    const current = media[currentIndex];
    if (!current) return;

    // For videos, don't auto-advance (handled by onEnded)
    if (current.type === "VIDEO") return;

    const timer = setTimeout(advance, (current.duration || defaultDuration) * 1000);
    return () => clearTimeout(timer);
  }, [currentIndex, media, advance, onComplete, defaultDuration]);

  if (media.length === 0) return null;

  const current = media[currentIndex];

  const transitionClass = (() => {
    if (!isVisible) return "opacity-0 scale-95";
    if (isTransitioning) {
      switch (transitionEffect) {
        case "slide":
          return "opacity-0 -translate-x-full";
        case "zoom":
          return "opacity-0 scale-110";
        default:
          return "opacity-0";
      }
    }
    return "opacity-100 scale-100 translate-x-0";
  })();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-500">
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${transitionClass}`}
      >
        {current.type === "IMAGE" ? (
          <Image
            src={current.url}
            alt={current.title || "Media"}
            fill
            className="object-contain"
            unoptimized
            priority
          />
        ) : (
          <video
            key={current.id}
            src={current.url}
            autoPlay
            muted
            className="h-full w-full object-contain"
            onEnded={advance}
          />
        )}
      </div>

      {/* Progress dots */}
      {media.length > 1 && (
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
          {media.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === currentIndex
                  ? "w-8 bg-white"
                  : "w-2 bg-white/40"
              }`}
            />
          ))}
        </div>
      )}

      {current.title && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2">
          <p className="rounded-lg bg-black/60 px-4 py-2 text-lg font-medium text-white backdrop-blur">
            {current.title}
          </p>
        </div>
      )}
    </div>
  );
}
