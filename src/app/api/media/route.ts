import { NextRequest, NextResponse } from "next/server";
import { requireMosqueForUser } from "@/lib/api/tenant";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const mosque = await requireMosqueForUser();
    const items = await prisma.media.findMany({
      where: { mosqueId: mosque.id },
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const mosque = await requireMosqueForUser();
    const body = await req.json();

    const item = await prisma.media.create({
      data: {
        mosqueId: mosque.id,
        type: body.type,
        url: body.url,
        title: body.title || null,
        duration: body.duration || 10,
        sortOrder: body.sortOrder || 0,
        isActive: body.isActive ?? true,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
