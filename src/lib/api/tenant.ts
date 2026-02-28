import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function getMosqueForUser() {
  const { orgId } = await auth();
  if (!orgId) return null;

  const mosque = await prisma.mosque.findFirst({
    where: { clerkOrgId: orgId },
  });

  return mosque;
}

export async function getMosqueBySlug(slug: string) {
  return prisma.mosque.findUnique({
    where: { slug, isActive: true },
  });
}

export async function requireMosqueForUser() {
  const mosque = await getMosqueForUser();
  if (!mosque) {
    throw new Error("No mosque found for current organization");
  }
  return mosque;
}
