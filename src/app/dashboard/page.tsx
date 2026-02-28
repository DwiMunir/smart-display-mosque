import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Clock,
  Megaphone,
  BookOpen,
  Image,
  Heart,
} from "lucide-react";

export default async function DashboardPage() {
  const { orgId } = await auth();
  if (!orgId) redirect("/sign-in");

  const mosque = await prisma.mosque.findFirst({
    where: { clerkOrgId: orgId },
    include: {
      _count: {
        select: {
          announcements: true,
          quranHadith: true,
          media: true,
          donations: true,
        },
      },
    },
  });

  if (!mosque) redirect("/sign-in");

  const stats = [
    {
      label: "Announcements",
      value: mosque._count.announcements,
      icon: Megaphone,
      href: "/dashboard/announcements",
    },
    {
      label: "Quran & Hadith",
      value: mosque._count.quranHadith,
      icon: BookOpen,
      href: "/dashboard/quran-hadith",
    },
    {
      label: "Media Items",
      value: mosque._count.media,
      icon: Image,
      href: "/dashboard/media",
    },
    {
      label: "Donation Campaigns",
      value: mosque._count.donations,
      icon: Heart,
      href: "/dashboard/donations",
    },
  ];

  const needsSetup = !mosque.city || !mosque.latitude;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back
        </h1>
        <p className="text-muted-foreground">
          Manage your mosque display for {mosque.name}
        </p>
      </div>

      {needsSetup && (
        <Card className="border-orange-500/30 bg-orange-500/5">
          <CardContent className="flex items-center gap-4 py-4">
            <Clock className="h-8 w-8 text-orange-500" />
            <div>
              <p className="font-semibold text-orange-600 dark:text-orange-400">
                Setup Required
              </p>
              <p className="text-sm text-muted-foreground">
                Go to <strong>Settings</strong> to configure your mosque location,
                timezone, and prayer time calculation method.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <a
              href={`/display/${mosque.slug}`}
              target="_blank"
              className="flex items-center gap-2 rounded-lg border p-3 text-sm transition-colors hover:bg-muted"
            >
              <Clock className="h-4 w-4 text-primary" />
              Open Display Screen
              <span className="ml-auto text-xs text-muted-foreground">
                /display/{mosque.slug}
              </span>
            </a>
            <a
              href="/dashboard/settings"
              className="flex items-center gap-2 rounded-lg border p-3 text-sm transition-colors hover:bg-muted"
            >
              <Clock className="h-4 w-4 text-primary" />
              Mosque Settings
            </a>
            <a
              href="/dashboard/prayer-times"
              className="flex items-center gap-2 rounded-lg border p-3 text-sm transition-colors hover:bg-muted"
            >
              <Clock className="h-4 w-4 text-primary" />
              Prayer Time Overrides
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Display Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mosque</span>
              <span className="font-medium">{mosque.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Location</span>
              <span className="font-medium">
                {mosque.city && mosque.country
                  ? `${mosque.city}, ${mosque.country}`
                  : "Not set"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Timezone</span>
              <span className="font-medium">{mosque.timezone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Display URL</span>
              <span className="font-mono text-xs">/display/{mosque.slug}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
