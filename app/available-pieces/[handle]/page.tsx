import Link from "next/link";
import { getProduct } from "@/lib/shopify";
import { Purchase } from "@/components/purchase";
import { notFound } from "next/navigation";
import { isSanityConfigured, sanityQuery } from "@/sanity/client";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const p = await getProduct((await params).handle);
  return {
    title: p?.title || "Pièce indisponible",
    description: p?.description,
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const handle = (await params).handle;
  const p = await getProduct(handle);
  if (!p) notFound();
  const editorial = isSanityConfigured
    ? await sanityQuery<{
        description?: string;
        dimensions?: string;
        materials?: string[];
      }>('*[_type=="availablePiece" && shopifyHandle==$handle][0]', { handle })
    : null;
  return (
    <main id="main">
      <section className="detail-intro">
        <div className="detail-photo">
          {p.featuredImage && (
            <img
              src={p.featuredImage.url}
              alt={p.featuredImage.altText || p.title}
            />
          )}
        </div>
        <div className="detail-copy">
          <Link className="back-link" href="/available-pieces">
            ← Les pièces disponibles
          </Link>
          <p className="eyebrow">UNE PIÈCE DU STUDIO</p>
          <h1>{p.title}</h1>
          <p className="detail-description">
            {editorial?.description || p.description}
          </p>
          {editorial?.dimensions && <p>Dimensions : {editorial.dimensions}</p>}
          {editorial?.materials?.length && (
            <p>{editorial.materials.join(" · ")}</p>
          )}
          <Purchase handle={handle} variants={p.variants.nodes} />
        </div>
      </section>
      <section className="detail-gallery">
        {p.images.nodes.slice(1).map((m) => (
          <figure key={m.url}>
            <img src={m.url} alt={m.altText || p.title} loading="lazy" />
          </figure>
        ))}
      </section>
    </main>
  );
}
