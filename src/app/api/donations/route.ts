import { NextRequest, NextResponse } from "next/server";
import { requireMosqueForUser } from "@/lib/api/tenant";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const mosque = await requireMosqueForUser();
    const items = await prisma.donation.findMany({
      where: { mosqueId: mosque.id },
      orderBy: { createdAt: "desc" },
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

    const item = await prisma.donation.create({
      data: {
        mosqueId: mosque.id,
        title: body.title,
        description: body.description || null,
        qrCodeUrl: body.qrCodeUrl || null,
        targetAmount: body.targetAmount || null,
        currentAmount: body.currentAmount || 0,
        currency: body.currency || "USD",
        isActive: body.isActive ?? true,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
