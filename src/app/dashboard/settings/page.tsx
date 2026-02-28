import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { SettingsForm } from "@/components/dashboard/settings-form-new";

export default async function SettingsPage() {
  const { orgId } = await auth();
  if (!orgId) redirect("/sign-in");

  const mosque = await prisma.mosque.findFirst({
    where: { clerkOrgId: orgId },
    include: { displaySettings: true },
  });
  if (!mosque) redirect("/dashboard");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure your mosque information and display appearance.
        </p>
      </div>
      <SettingsForm
        mosque={{
          name: mosque.name,
          slug: mosque.slug,
          city: mosque.city,
          country: mosque.country,
          latitude: mosque.latitude,
          longitude: mosque.longitude,
          timezone: mosque.timezone,
          logoUrl: mosque.logoUrl,
        }}
        displaySettings={
          mosque.displaySettings
            ? {
                theme: mosque.displaySettings.theme,
                primaryColor: mosque.displaySettings.primaryColor,
                secondaryColor: mosque.displaySettings.secondaryColor ?? "#3b82f6",
                showHijriDate: mosque.displaySettings.showHijriDate,
                showGregorianDate: mosque.displaySettings.showGregorianDate,
                clockFormat: mosque.displaySettings.clockFormat ?? "12h",
                announcementDuration: mosque.displaySettings.announcementDuration,
                transitionEffect: mosque.displaySettings.transitionEffect ?? "fade",
                mediaInterval: mosque.displaySettings.mediaInterval ?? 10,
                infoDuration: mosque.displaySettings.infoDuration ?? 30,
              }
            : null
        }
      />
    </div>
  );
}
