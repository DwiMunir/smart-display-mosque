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

    const data: Record<string, unknown> = {};
    if (body.title !== undefined) data.title = body.title;
    if (body.content !== undefined) data.content = body.content;
    if (body.priority !== undefined) data.priority = body.priority;
    if (body.endDate !== undefined)
      data.endDate = body.endDate ? new Date(body.endDate) : null;
    if (body.isActive !== undefined) data.isActive = body.isActive;

    await prisma.announcement.updateMany({
      where: { id, mosqueId: mosque.id },
      data,
    });

    return NextResponse.json({ success: true });
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

    await prisma.announcement.deleteMany({
      where: { id, mosqueId: mosque.id },
    });

    return NextResponse.json({ deleted: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
