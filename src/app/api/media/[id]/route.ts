import { NextRequest, NextResponse } from "next/server";
import { requireMosqueForUser } from "@/lib/api/tenant";
import { prisma } from "@/lib/db";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const mosque = await requireMosqueForUser();
    const { id } = await params;
    const body = await req.json();

    const item = await prisma.media.updateMany({
      where: { id, mosqueId: mosque.id },
      data: {
        type: body.type,
        url: body.url,
        title: body.title,
        duration: body.duration,
        sortOrder: body.sortOrder,
        isActive: body.isActive,
      },
    });

    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const mosque = await requireMosqueForUser();
    const { id } = await params;

    await prisma.media.deleteMany({
      where: { id, mosqueId: mosque.id },
    });

    return NextResponse.json({ deleted: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
