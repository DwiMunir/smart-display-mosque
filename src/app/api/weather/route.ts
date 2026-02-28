import { NextRequest, NextResponse } from "next/server";
import { requireMosqueForUser } from "@/lib/api/tenant";
import { fetchWeather } from "@/lib/api/weather";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const mosque = await requireMosqueForUser();
    const settings = await prisma.weatherSettings.findUnique({
      where: { mosqueId: mosque.id },
    });

    if (!settings) {
      return NextResponse.json({ settings: null, weather: null });
    }

    let weather = null;
    const apiKey = process.env.WEATHER_API_KEY;
    if (apiKey && settings.location) {
      try {
        weather = await fetchWeather(settings.location, apiKey);
      } catch {
        // Weather fetch failed
      }
    }

    return NextResponse.json({ settings, weather });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const mosque = await requireMosqueForUser();
    const body = await req.json();

    const settings = await prisma.weatherSettings.upsert({
      where: { mosqueId: mosque.id },
      update: {
        location: body.location,
        unit: body.unit || "metric",
      },
      create: {
        mosqueId: mosque.id,
        location: body.location,
        unit: body.unit || "metric",
      },
    });

    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
