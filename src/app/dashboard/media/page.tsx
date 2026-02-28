import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { MediaClient } from "@/components/dashboard/media-client";

export default async function MediaPage() {
  const { orgId } = await auth();
  if (!orgId) redirect("/sign-in");

  const mosque = await prisma.mosque.findFirst({
    where: { clerkOrgId: orgId },
  });
  if (!mosque) redirect("/dashboard");

  const items = await prisma.media.findMany({
    where: { mosqueId: mosque.id },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Media</h1>
        <p className="text-muted-foreground">
          Manage images and videos that cycle on your display as a carousel overlay.
        </p>
      </div>
      <MediaClient
        items={items.map((i) => ({
          id: i.id,
          type: i.type as "IMAGE" | "VIDEO",
          url: i.url,
          title: i.title,
          duration: i.duration,
          sortOrder: i.sortOrder,
          isActive: i.isActive,
        }))}
      />
    </div>
  );
}
