"use client";

import { useEffect, useRef, useState } from "react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: string;
}

interface AnnouncementsTickerProps {
  announcements: Announcement[];
  speed?: number;
}

export function AnnouncementsTicker({
  announcements,
  speed = 25,
}: AnnouncementsTickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [shouldAnimate, setShouldAnimate] = useState(true);

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && textRef.current) {
        setShouldAnimate(
          textRef.current.scrollWidth > containerRef.current.clientWidth
        );
      }
    };
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [announcements]);

  if (announcements.length === 0) return null;

  const text = announcements
    .map((a) => `${a.title}: ${a.content}`)
    .join("     ★     ");

  return (
    <div className="w-full overflow-hidden rounded-xl border border-border/30 bg-card/70 backdrop-blur-lg">
      <div className="flex items-center h-16">
        {/* Label */}
        <div className="shrink-0 bg-mosque-green px-6 py-3 h-full flex items-center gap-3 rounded-l-xl">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
          <span className="text-base font-bold uppercase tracking-wider text-white">
            Announcements
          </span>
        </div>

        {/* Scrolling Text */}
        <div
          ref={containerRef}
          className="flex-1 overflow-hidden whitespace-nowrap relative"
        >
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-card/70 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-card/70 to-transparent z-10 pointer-events-none" />
          
          <div
            ref={textRef}
            className="inline-flex items-center px-8"
            style={
              shouldAnimate
                ? {
                    animation: `marquee ${speed}s linear infinite`,
                  }
                : undefined
            }
          >
            <span className="text-xl font-medium text-foreground tracking-wide">
              {text}
            </span>
            {shouldAnimate && (
              <span className="text-xl font-medium text-foreground tracking-wide ml-48">
                {text}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
