import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { DonationsClient } from "@/components/dashboard/donations-client";

export default async function DonationsPage() {
  const { orgId } = await auth();
  if (!orgId) redirect("/sign-in");

  const mosque = await prisma.mosque.findFirst({
    where: { clerkOrgId: orgId },
  });
  if (!mosque) redirect("/dashboard");

  const items = await prisma.donation.findMany({
    where: { mosqueId: mosque.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Donations</h1>
        <p className="text-muted-foreground">
          Manage donation campaigns shown on your display screen.
        </p>
      </div>
      <DonationsClient
        items={items.map((i) => ({
          id: i.id,
          title: i.title,
          description: i.description,
          qrCodeUrl: i.qrCodeUrl,
          targetAmount: i.targetAmount,
          currentAmount: i.currentAmount,
          currency: i.currency,
          isActive: i.isActive,
        }))}
      />
    </div>
  );
}
