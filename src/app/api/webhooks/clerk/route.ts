import { NextRequest, NextResponse } from "next/server";
import { createMosqueWithDefaults } from "@/lib/api/mosque-setup";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const eventType = payload.type as string;

  if (eventType === "organization.created") {
    const { id, name, slug } = payload.data;

    // Create mosque with all default settings and Quran/Hadith content
    await createMosqueWithDefaults({
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
      clerkOrgId: id,
      city: "",
      country: "",
      latitude: 0,
      longitude: 0,
      timezone: "UTC",
    });
  }

  if (eventType === "organization.updated") {
    const { id, name, slug } = payload.data;
    await prisma.mosque.updateMany({
      where: { clerkOrgId: id },
      data: { name, slug: slug || undefined },
    });
  }

  if (eventType === "organization.deleted") {
    const { id } = payload.data;
    await prisma.mosque.deleteMany({ where: { clerkOrgId: id } });
  }

  return NextResponse.json({ received: true });
}
