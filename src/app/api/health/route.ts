import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const health = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {
      database: "unknown",
    },
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    health.checks.database = "connected";
  } catch {
    health.checks.database = "disconnected";
    health.status = "unhealthy";
  }

  const statusCode = health.status === "healthy" ? 200 : 503;
  return NextResponse.json(health, { status: statusCode });
}
