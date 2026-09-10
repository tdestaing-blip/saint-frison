import { RelatedEntries } from "@/components/related-entries";
import Link from "@/components/site-link";
import { notFound } from "next/navigation";
import { getEntry, getRelatedEntries, getPageCopy } from "@/lib/content";
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
  const copy = await getPageCopy();
  return (
    <main id="main">
      <header className="project-title">
        <Link className="back-link" href="/projects">
          ← Les projets
        </Link>
        <p className="eyebrow">
          {e.category?.toLowerCase() === "recherche & application"
            ? "PROJET"
            : e.category || "PROJET"}
        </p>
        <h1>{e.title}</h1>
        {e.description && <p>{e.description}</p>}
        {[e.clientOrCollaborator, e.location, e.year].some(Boolean) && (
          <p className="project-credits">
            {[e.clientOrCollaborator, e.location, e.year]
              .filter(Boolean)
              .join(" · ")}
          </p>
        )}
      </header>
      {e.heroMedia?.src && (
        <div className="project-hero">
          <Photo media={e.heroMedia} priority sizes="100vw" />
        </div>
      )}
      <article className="project-story">
        {!e.contentBlocks?.length &&
          e.gallery?.map((m) => (
            <figure className="editorial-block block-full" key={m.src}>
              <Photo media={m} />
              {m.credit && <figcaption>{m.credit}</figcaption>}
            </figure>
          ))}
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
        {e.credits && <p className="project-credits">{e.credits}</p>}
        {!!e.applications?.length && (
          <p className="project-credits">
            Applications : {e.applications.join(" · ")}
          </p>
        )}
        <RelatedEntries entries={await getRelatedEntries(e)} />
      </article>
      <section className="bespoke">
        <Link
          className="text-link"
          href={
            "/contact?type=Sur%20mesure&reference=" +
            encodeURIComponent(e.title) +
            "&source=" +
            encodeURIComponent("/projects/" + e.slug)
          }
        >
          {copy.projectCta} <span>↗</span>
        </Link>
      </section>
    </main>
  );
}
