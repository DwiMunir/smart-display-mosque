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

    const item = await prisma.quranHadith.updateMany({
      where: { id, mosqueId: mosque.id },
      data: {
        type: body.type,
        textArabic: body.textArabic,
        textTranslation: body.textTranslation,
        reference: body.reference,
        isActive: body.isActive,
        sortOrder: body.sortOrder,
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

    await prisma.quranHadith.deleteMany({
      where: { id, mosqueId: mosque.id },
    });

    return NextResponse.json({ deleted: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
