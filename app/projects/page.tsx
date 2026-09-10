import Link from "@/components/site-link";
import { getEntries } from "@/lib/content";
import { Photo } from "@/components/photo";
export const metadata = {
  title: "Projets",
  description:
    "Du fil à l’espace : recherches textiles, applications et projets Saint-Frison.",
};
export default async function Page() {
  const entries = await getEntries("project");
  return (
    <main id="main">
      <header className="page-intro">
        <p className="eyebrow">DU FIL À L’ESPACE</p>
        <div>
          <h1>Projets</h1>
          <p>
            La matière trouve sa place.
            <br />
            Une sélection de recherches et d’applications.
          </p>
        </div>
      </header>
      <section className="projects-index">
        {entries.map((e) => (
          <Link
            href={"/projects/" + e.slug}
            key={e.slug}
            className="image-card"
          >
            <div className="image-wrap">
              <Photo media={e.heroMedia} priority sizes="90vw" />
            </div>
            <div className="card-caption">
              <h3>{e.title}</h3>
              <span>{e.category || e.location} ↗</span>
            </div>
          </Link>
        ))}
        {!entries.length && (
          <p>Chaque projet commence par un échange avec le studio.</p>
        )}
      </section>
      <section className="bespoke">
        <h2>Écrivons la suite.</h2>
        <Link className="text-link" href="/contact?type=Sur%20mesure">
          Discuter d’un projet <span>↗</span>
        </Link>
      </section>
    </main>
  );
}
