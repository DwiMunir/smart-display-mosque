import { NextRequest, NextResponse } from "next/server";
import { requireMosqueForUser } from "@/lib/api/tenant";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const mosque = await requireMosqueForUser();
    const items = await prisma.announcement.findMany({
      where: { mosqueId: mosque.id },
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
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

    const item = await prisma.announcement.create({
      data: {
        mosqueId: mosque.id,
        title: body.title,
        content: body.content,
        priority: body.priority || "medium",
        startDate: body.startDate ? new Date(body.startDate) : new Date(),
        endDate: body.endDate ? new Date(body.endDate) : null,
        isActive: body.isActive ?? true,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
