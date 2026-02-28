import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { fetchPrayerTimes, getMockPrayerTimes } from "@/lib/aladhan";
import { calculatePrayerTimesWithMeta } from "@/lib/prayer-time-calculator";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);
  const dateParam = searchParams.get("date") ?? undefined;

  try {
    const mosque = await prisma.mosque.findUnique({
      where: { slug },
      include: {
        prayerTimeOverrides: dateParam
          ? { where: { date: new Date(dateParam) } }
          : { where: { date: new Date(new Date().toISOString().split("T")[0]) } },
      },
    });

    if (!mosque) {
      return NextResponse.json({ error: "Mosque not found" }, { status: 404 });
    }

    let prayerTimes;
    try {
      prayerTimes = await fetchPrayerTimes(
        mosque.latitude,
        mosque.longitude,
        mosque.calculationMethod,
        dateParam
      );
    } catch {
      prayerTimes = getMockPrayerTimes();
    }

    const override = mosque.prayerTimeOverrides[0];
    const overrides = override
      ? {
          fajr: override.fajr,
          dhuhr: override.dhuhr,
          asr: override.asr,
          maghrib: override.maghrib,
          isha: override.isha,
        }
      : undefined;

    const result = calculatePrayerTimesWithMeta(
      prayerTimes,
      mosque.timezone,
      overrides
    );

    return NextResponse.json({
      mosque: { name: mosque.name, slug: mosque.slug, timezone: mosque.timezone },
      ...result,
    });
  } catch (error) {
    console.error("Failed to fetch prayer times:", error);
    return NextResponse.json({ error: "Failed to fetch prayer times" }, { status: 500 });
  }
}
