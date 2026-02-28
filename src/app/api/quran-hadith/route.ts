import { NextRequest, NextResponse } from "next/server";
import { requireMosqueForUser } from "@/lib/api/tenant";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const mosque = await requireMosqueForUser();
    const items = await prisma.quranHadith.findMany({
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

    const item = await prisma.quranHadith.create({
      data: {
        mosqueId: mosque.id,
        type: body.type,
        textArabic: body.textArabic,
        textTranslation: body.textTranslation,
        reference: body.reference,
        isActive: body.isActive ?? true,
        sortOrder: body.sortOrder ?? 0,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
