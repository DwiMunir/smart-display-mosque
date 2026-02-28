import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { QuranHadithClient } from "@/components/dashboard/quran-hadith-client";

export default async function QuranHadithPage() {
  const { orgId } = await auth();
  if (!orgId) redirect("/sign-in");

  const mosque = await prisma.mosque.findFirst({
    where: { clerkOrgId: orgId },
  });
  if (!mosque) redirect("/dashboard");

  const items = await prisma.quranHadith.findMany({
    where: { mosqueId: mosque.id },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Quran & Hadith</h1>
        <p className="text-muted-foreground">
          Manage Quran verses and Hadith that rotate on your display screen.
        </p>
      </div>
      <QuranHadithClient
        items={items.map((i) => ({
          id: i.id,
          type: i.type as "QURAN" | "HADITH",
          textArabic: i.textArabic,
          textTranslation: i.textTranslation,
          reference: i.reference,
          isActive: i.isActive,
          sortOrder: i.sortOrder,
        }))}
      />
    </div>
  );
}
