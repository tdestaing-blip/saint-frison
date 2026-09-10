import { RelatedEntries } from "@/components/related-entries";
import Link from "@/components/site-link";
import { notFound } from "next/navigation";
import { getEntry, getRelatedEntries } from "@/lib/content";
import { Photo } from "@/components/photo";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const e = await getEntry("project", (await params).slug);
  return {
    title: e?.metaTitle || e?.title || "Projet introuvable",
    description: e?.metaDescription || e?.description,
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const e = await getEntry("project", (await params).slug);
  if (!e) notFound();
  return (
    <main id="main">
      <header className="project-title">
        <Link className="back-link" href="/projects">
          ← Les projets
        </Link>
        <p className="eyebrow">{e.category || "PROJET"}</p>
        <h1>{e.title}</h1>
        <p>{e.description}</p>
      </header>
      <div className="project-hero">
        <Photo media={e.heroMedia} priority sizes="100vw" />
      </div>
      <article className="project-story">
        {e.contentBlocks?.map((b) => (
          <section key={b._key} className={"editorial-block block-" + b.type}>
            {b.images?.map((m) => (
              <figure key={m.src}>
                <Photo media={m} />
                {m.credit && (
                  <figcaption className="small-note">
                    Photo : {m.credit}
                  </figcaption>
                )}
              </figure>
            ))}
            {b.text && <p>{b.text}</p>}
          </section>
        ))}
        {[e.year, e.location, e.clientOrCollaborator, e.credits].some(
          Boolean,
        ) && (
          <p className="project-credits">
            {[e.year, e.location, e.clientOrCollaborator, e.credits]
              .filter(Boolean)
              .join(" · ")}
          </p>
        )}
        {!!e.applications?.length && (
          <p className="project-credits">
            Applications : {e.applications.join(" · ")}
          </p>
        )}
        <RelatedEntries entries={await getRelatedEntries(e)} />
      </article>
      <section className="bespoke">
        <h2>
          Et si nous tissions
          <br />
          <em>votre projet ?</em>
        </h2>
        <Link
          className="text-link"
          href={
            "/contact?type=Sur%20mesure&reference=" +
            encodeURIComponent(e.title) +
            "&source=" +
            encodeURIComponent("/projects/" + e.slug)
          }
        >
          Ouvrir la conversation <span>↗</span>
        </Link>
      </section>
    </main>
  );
}
