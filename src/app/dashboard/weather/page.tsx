import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { WeatherForm } from "@/components/dashboard/weather-form";

export default async function WeatherPage() {
  const { orgId } = await auth();
  if (!orgId) redirect("/sign-in");

  const mosque = await prisma.mosque.findFirst({
    where: { clerkOrgId: orgId },
  });
  if (!mosque) redirect("/dashboard");

  const settings = await prisma.weatherSettings.findUnique({
    where: { mosqueId: mosque.id },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Weather</h1>
        <p className="text-muted-foreground">
          Configure the weather location shown on your display screen.
        </p>
      </div>
      <WeatherForm
        settings={
          settings ? { location: settings.location, unit: settings.unit } : null
        }
      />
    </div>
  );
}
