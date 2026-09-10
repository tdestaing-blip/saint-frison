import { getEntry, getRelatedEntries } from "@/lib/content";
import { EntryDetail } from "@/components/entry-detail";
import { notFound } from "next/navigation";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const e = await getEntry("textile", (await params).slug);
  return {
    title: e?.metaTitle || e?.title || "Textile introuvable",
    description: e?.metaDescription || e?.description,
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const e = await getEntry("textile", (await params).slug);
  if (!e) notFound();
  return (
    <main id="main">
      <EntryDetail
        entry={e}
        related={await getRelatedEntries(e)}
        type="textile"
      />
    </main>
  );
}
