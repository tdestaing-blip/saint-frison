import { permanentRedirect } from "next/navigation";
import { getEntries } from "@/lib/content";
import { isSanityConfigured, sanityQuery } from "@/sanity/client";
export default async function Page({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const entries = await getEntries("lighting");
  const legacy = isSanityConfigured
    ? await sanityQuery<{ slug?: string }>(
        '*[_type=="availablePiece" && shopifyHandle==$handle][0]{"slug":lighting->slug.current}',
        { handle },
      )
    : null;
  const match =
    entries.find((e) => e.slug === legacy?.slug) ||
    entries.find((e) => e.shopifyHandle === handle);
  permanentRedirect(match ? "/lighting/" + match.slug : "/lighting");
}
