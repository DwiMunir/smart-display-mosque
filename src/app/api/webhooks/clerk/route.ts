import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const eventType = payload.type as string;

  if (eventType === "organization.created") {
    const { id, name, slug } = payload.data;
    await prisma.mosque.create({
      data: {
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
        clerkOrgId: id,
        city: "",
        country: "",
        latitude: 0,
        longitude: 0,
        displaySettings: { create: {} },
      },
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
