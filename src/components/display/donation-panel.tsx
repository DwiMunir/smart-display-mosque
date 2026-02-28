"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface DonationData {
  id: string;
  title: string;
  description: string | null;
  qrCodeUrl: string | null;
  targetAmount: number | null;
  currentAmount: number;
  currency: string;
}

interface DonationPanelProps {
  donation: DonationData | null;
}

export function DonationPanel({ donation }: DonationPanelProps) {
  if (!donation) {
    return null;
  }

  const progress =
    donation.targetAmount && donation.targetAmount > 0
      ? Math.min((donation.currentAmount / donation.targetAmount) * 100, 100)
      : null;

  return (
    <Card className="border-mosque-gold/20 bg-card/60 backdrop-blur">
      <CardContent className="py-4">
        <h3 className="text-sm font-medium uppercase tracking-widest text-mosque-gold/80 mb-2">
          Donate
        </h3>
        <p className="text-lg font-semibold text-foreground">{donation.title}</p>
        {donation.description && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {donation.description}
          </p>
        )}

        {progress !== null && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>
                {donation.currency}{" "}
                {donation.currentAmount.toLocaleString()} raised
              </span>
              <span>
                {donation.currency}{" "}
                {donation.targetAmount!.toLocaleString()} goal
              </span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-mosque-gold transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {donation.qrCodeUrl && (
          <div className="mt-3 flex justify-center">
            <Image
              src={donation.qrCodeUrl}
              alt="Donation QR Code"
              width={120}
              height={120}
              className="rounded-lg"
              unoptimized
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
