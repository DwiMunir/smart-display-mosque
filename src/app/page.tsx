import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Monitor, Clock, Cloud, BookOpen, Megaphone } from "lucide-react";

export default async function HomePage() {
  let mosques: {
    id: string;
    slug: string;
    name: string;
    city: string;
    country: string;
    isActive: boolean;
    _count: { announcements: number };
  }[] = [];

  try {
    mosques = await prisma.mosque.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      include: {
        _count: { select: { announcements: true } },
      },
    });
  } catch {
    // DB not available
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden border-b bg-gradient-to-br from-primary/5 via-background to-mosque-gold/5">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm">
            <Monitor className="h-4 w-4 text-primary" />
            <span>Smart Digital Signage for Mosques</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            Smart Mosque Display
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Beautiful, real-time digital displays for your mosque — prayer times,
            weather, Quran verses, donations, and announcements, all managed from
            an easy dashboard.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/dashboard">Open Dashboard</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-center text-2xl font-bold mb-8">Features</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Clock, label: "Prayer Times", desc: "Auto-calculated with iqamah offsets" },
            { icon: Cloud, label: "Weather", desc: "Real-time conditions & temperature" },
            { icon: BookOpen, label: "Quran & Hadith", desc: "Rotating verses on display" },
            { icon: Megaphone, label: "Announcements", desc: "Scrolling ticker with priority" },
          ].map((f) => (
            <Card key={f.label} className="text-center">
              <CardContent className="pt-6">
                <f.icon className="mx-auto h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold">{f.label}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Mosque List */}
      {mosques.length > 0 && (
        <div className="mx-auto max-w-5xl px-6 pb-16">
          <h2 className="text-center text-2xl font-bold mb-8">Active Mosques</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mosques.map((mosque) => (
              <Card
                key={mosque.id}
                className="group transition-shadow hover:shadow-lg"
              >
                <CardHeader>
                  <CardTitle className="text-lg">{mosque.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {mosque.city && mosque.country
                      ? `${mosque.city}, ${mosque.country}`
                      : "Location not set"}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Badge variant="secondary">
                      {mosque._count.announcements} announcements
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="default" size="sm" className="flex-1">
                      <Link href={`/display/${mosque.slug}`}>
                        <Monitor className="mr-2 h-4 w-4" />
                        Display
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>Smart Mosque Display — Digital signage for the modern mosque</p>
      </footer>
    </div>
  );
}
