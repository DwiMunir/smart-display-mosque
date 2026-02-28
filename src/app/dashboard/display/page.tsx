import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { DisplayCustomizationForm } from "@/components/dashboard/display-customization-form";

export default async function DisplayPage() {
  const { orgId } = await auth();
  if (!orgId) redirect("/sign-in");

  const mosque = await prisma.mosque.findFirst({
    where: { clerkOrgId: orgId },
    include: { displaySettings: true },
  });
  if (!mosque) redirect("/dashboard");

  const ds = mosque.displaySettings;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Display Customization
        </h1>
        <p className="text-muted-foreground">
          Control which sections are visible on your display and adjust ticker
          speed.
        </p>
      </div>
      <DisplayCustomizationForm
        settings={{
          showPrayerTimes: ds?.showPrayerTimes ?? true,
          showAnnouncements: ds?.showAnnouncements ?? true,
          showWeather: ds?.showWeather ?? true,
          showDonations: ds?.showDonations ?? true,
          showQuranHadith: ds?.showQuranHadith ?? true,
          showClock: ds?.showClock ?? true,
          showCountdown: ds?.showCountdown ?? true,
          showLocation: ds?.showLocation ?? true,
          showLogo: ds?.showLogo ?? true,
          marqueeSpeed: ds?.marqueeSpeed ?? 25,
        }}
      />
    </div>
  );
}
