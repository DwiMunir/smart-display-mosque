import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { AnnouncementsClient } from "@/components/dashboard/announcements-client";

export default async function AnnouncementsPage() {
  const { orgId } = await auth();
  if (!orgId) redirect("/sign-in");

  const mosque = await prisma.mosque.findFirst({
    where: { clerkOrgId: orgId },
  });
  if (!mosque) redirect("/dashboard");

  const items = await prisma.announcement.findMany({
    where: { mosqueId: mosque.id },
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Announcements</h1>
        <p className="text-muted-foreground">
          Manage announcements shown as a scrolling ticker on your display.
        </p>
      </div>
      <AnnouncementsClient
        items={items.map((i) => ({
          id: i.id,
          title: i.title,
          content: i.content,
          priority: i.priority,
          startDate: i.startDate.toISOString(),
          endDate: i.endDate?.toISOString() ?? null,
          isActive: i.isActive,
        }))}
      />
    </div>
  );
}
