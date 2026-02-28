"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

interface DonationData {
  id: string;
  title: string;
  description: string | null;
  qrCodeUrl: string | null;
  targetAmount: number | null;
  currentAmount: number;
  currency: string;
}

interface MosqueBrandingPanelProps {
  mosqueName: string;
  logoUrl?: string | null;
  donations?: DonationData[];
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function MosqueBrandingPanel({
  mosqueName,
  logoUrl,
  donations = [],
}: MosqueBrandingPanelProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const advance = useCallback(() => {
    if (donations.length <= 1) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % donations.length);
      setIsTransitioning(false);
    }, 400);
  }, [donations.length]);

  useEffect(() => {
    if (donations.length <= 1) return;
    const timer = setInterval(advance, 12000);
    return () => clearInterval(timer);
  }, [advance, donations.length]);

  const donation = donations.length > 0 ? donations[currentIndex] : null;
  const progress = donation?.targetAmount
    ? Math.min((donation.currentAmount / donation.targetAmount) * 100, 100)
    : 0;

  return (
    <Card className="h-full border-mosque-green/20 bg-card/60 backdrop-blur">
      <CardContent className="flex h-full flex-col items-center justify-between py-5">
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-3">
          {logoUrl ? (
            <div className="relative h-24 w-24 overflow-hidden rounded-lg">
              <Image
                src={logoUrl}
                alt={mosqueName}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-mosque-green/10 ring-1 ring-mosque-green/20">
              <span className="text-4xl font-bold text-mosque-green">
                {mosqueName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* Mosque Name */}
          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground">
              {mosqueName}
            </h2>
            <p className="font-amiri text-lg text-muted-foreground" dir="rtl">
              مسجد
            </p>
          </div>
        </div>

        {/* QR Code Section */}
        {donation?.qrCodeUrl && (
          <div className="flex flex-col items-center gap-2 mt-4">
            <div className="relative h-28 w-28 overflow-hidden rounded-lg bg-white p-1">
              <Image
                src={donation.qrCodeUrl}
                alt="Scan to Donate"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <p className="text-base font-medium uppercase tracking-wider text-mosque-gold">
              Scan to Donate
            </p>
          </div>
        )}

        {/* Donation Campaign Section */}
        {donation && (
          <div
            className={`w-full mt-4 pt-4 border-t border-mosque-green/20 transition-opacity duration-400 ${
              isTransitioning ? "opacity-0" : "opacity-100"
            }`}
          >
            {/* Carousel Indicator */}
            {donations.length > 1 && (
              <div className="flex items-center justify-center gap-2 mb-3">
                {donations.map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === currentIndex
                        ? "w-6 bg-mosque-green"
                        : "w-2 bg-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Campaign Title */}
            <h3 className="text-xl font-bold text-mosque-green text-center mb-2 line-clamp-2">
              {donation.title}
            </h3>

            {/* Campaign Description */}
            {donation.description && (
              <p className="text-base text-muted-foreground text-center mb-4 line-clamp-2">
                {donation.description}
              </p>
            )}

            {/* Progress Bar */}
            {donation.targetAmount && donation.targetAmount > 0 && (
              <div className="space-y-3">
                <div className="w-full h-4 bg-muted/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-mosque-green to-mosque-gold rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Progress Stats */}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-mosque-green">
                    {formatCurrency(donation.currentAmount, donation.currency)}
                  </span>
                  <span className="text-base text-muted-foreground">
                    of{" "}
                    {formatCurrency(donation.targetAmount, donation.currency)}
                  </span>
                </div>

                {/* Percentage */}
                <div className="text-center">
                  <span className="text-xl font-bold text-mosque-gold">
                    {progress.toFixed(0)}% Funded
                  </span>
                </div>
              </div>
            )}

            {/* No Target - Just Show Current Amount */}
            {(!donation.targetAmount || donation.targetAmount === 0) &&
              donation.currentAmount > 0 && (
                <div className="text-center">
                  <span className="text-2xl font-bold text-mosque-green">
                    {formatCurrency(donation.currentAmount, donation.currency)}
                  </span>
                  <p className="text-base text-muted-foreground">Raised</p>
                </div>
              )}
          </div>
        )}

        {/* Fallback when no donations */}
        {donations.length === 0 && (
          <div className="flex flex-col items-center gap-2 mt-4">
            <div className="flex h-28 w-28 items-center justify-center rounded-lg bg-muted/50">
              <span className="text-base text-muted-foreground text-center px-2">
                QR Code Available Soon
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
