import { getEntry, getRelatedEntries, getPageCopy } from "@/lib/content";
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
    <main id="main" className="material-detail">
      <EntryDetail
        entry={e}
        related={await getRelatedEntries(e)}
        copy={await getPageCopy()}
        type="textile"
      />
    </main>
  );
}
