import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DEFAULT_QURAN_HADITH } from "@/lib/default-quran-hadith";

function generateSlug(orgId: string): string {
  return `mosque-${orgId
    .replace(/[^a-z0-9]/gi, "")
    .slice(0, 12)
    .toLowerCase()}`;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, orgId } = await auth();

  // Not signed in at all → go to sign-in
  if (!userId) {
    redirect("/sign-in");
  }

  // Signed in but no organization selected → go to org picker
  if (!orgId) {
    redirect("/select-organization");
  }

  let mosque = await prisma.mosque.findFirst({
    where: { clerkOrgId: orgId },
  });

  // Auto-create mosque for org with default content
  if (!mosque) {
    mosque = await prisma.mosque.create({
      data: {
        name: "My Mosque",
        slug: generateSlug(orgId),
        clerkOrgId: orgId,
        city: "",
        country: "",
        latitude: 0,
        longitude: 0,
        displaySettings: { create: {} },
        quranHadith: {
          create: DEFAULT_QURAN_HADITH.map((item) => ({
            type: item.type,
            textArabic: item.textArabic,
            textTranslation: item.textTranslation,
            reference: item.reference,
            sortOrder: item.sortOrder,
            isActive: true,
          })),
        },
      },
    });
  }

  return (
    <DashboardShell mosqueName={mosque.name} mosqueSlug={mosque.slug}>
      {children}
    </DashboardShell>
  );
}
