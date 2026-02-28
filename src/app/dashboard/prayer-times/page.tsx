import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { PrayerTimesForm } from "@/components/dashboard/prayer-times-form";

export default async function PrayerTimesPage() {
  const { orgId } = await auth();
  if (!orgId) redirect("/sign-in");

  const mosque = await prisma.mosque.findFirst({
    where: { clerkOrgId: orgId },
  });

  if (!mosque) redirect("/dashboard");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Prayer Times</h1>
        <p className="text-muted-foreground">
          Configure location, calculation method, and iqamah offsets for prayer times.
        </p>
      </div>
      <PrayerTimesForm
        mosque={{
          latitude: mosque.latitude,
          longitude: mosque.longitude,
          city: mosque.city,
          country: mosque.country,
          timezone: mosque.timezone,
          calculationMethod: mosque.calculationMethod,
          asrMethod: mosque.asrMethod ?? 0,
          iqamahOffsets: mosque.iqamahOffsets as Record<string, number> | null,
        }}
      />
    </div>
  );
}
