import { notFound } from "next/navigation";

async function fetchDisplayData(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/display/${slug}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  return res.json();
}

// We import dynamically to avoid SSR issues with the display client
import { DisplayContainer } from "@/components/display/display-container";

export default async function DisplayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const data = await fetchDisplayData(slug);

  if (!data || data.error) {
    notFound();
  }

  return <DisplayContainer initialData={data} slug={slug} />;
}
