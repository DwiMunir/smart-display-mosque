import { NextRequest, NextResponse } from "next/server";
import { requireMosqueForUser } from "@/lib/api/tenant";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const mosque = await requireMosqueForUser();
    const settings = await prisma.displaySettings.findUnique({
      where: { mosqueId: mosque.id },
    });
    const weatherSettings = await prisma.weatherSettings.findUnique({
      where: { mosqueId: mosque.id },
    });

    return NextResponse.json({
      mosque: {
        id: mosque.id,
        name: mosque.name,
        slug: mosque.slug,
        city: mosque.city,
        country: mosque.country,
        latitude: mosque.latitude,
        longitude: mosque.longitude,
        timezone: mosque.timezone,
        calculationMethod: mosque.calculationMethod,
        asrMethod: mosque.asrMethod,
        iqamahOffsets: mosque.iqamahOffsets,
        logoUrl: mosque.logoUrl,
      },
      displaySettings: settings,
      weatherSettings,
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const mosque = await requireMosqueForUser();
    const body = await req.json();

    // Update mosque info
    if (body.mosque) {
      await prisma.mosque.update({
        where: { id: mosque.id },
        data: {
          name: body.mosque.name,
          city: body.mosque.city,
          country: body.mosque.country,
          latitude: body.mosque.latitude,
          longitude: body.mosque.longitude,
          timezone: body.mosque.timezone,
          calculationMethod: body.mosque.calculationMethod,
          asrMethod: body.mosque.asrMethod,
          iqamahOffsets: body.mosque.iqamahOffsets,
          logoUrl: body.mosque.logoUrl,
        },
      });
    }

    // Update display settings
    if (body.displaySettings) {
      await prisma.displaySettings.upsert({
        where: { mosqueId: mosque.id },
        update: body.displaySettings,
        create: { mosqueId: mosque.id, ...body.displaySettings },
      });
    }

    // Update weather settings
    if (body.weatherSettings) {
      await prisma.weatherSettings.upsert({
        where: { mosqueId: mosque.id },
        update: body.weatherSettings,
        create: { mosqueId: mosque.id, ...body.weatherSettings },
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
