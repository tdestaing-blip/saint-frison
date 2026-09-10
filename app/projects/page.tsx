import Link from "@/components/site-link";
import { getEntries, getPageCopy } from "@/lib/content";
import { CatalogCard } from "@/components/catalog-card";
export const metadata = {
  title: "Projets",
  description:
    "Applications textiles et projets Saint-Frison pour l’architecture intérieure.",
};
export default async function Page() {
  const copy = await getPageCopy();
  const entries = await getEntries("project");
  return (
    <main id="main">
      <header className="page-intro">
        <div>
          <h1>{copy.projectsTitle}</h1>
          <p>{copy.projectsIntroduction}</p>
        </div>
      </header>
      <section className="catalog-section" aria-label="Catalogue des projets">
        <div className="catalog-grid">
          {entries.map((entry, i) => (
            <CatalogCard key={entry._id} entry={entry} priority={i === 0} />
          ))}
        </div>
        {!entries.length && (
          <p className="empty-note">
            Les projets seront présentés prochainement.
          </p>
        )}
      </section>
      <section className="bespoke">
        <h2>Votre projet</h2>
        <Link className="text-link" href="/contact?type=Projet%20sur%20mesure">
          {copy.projectCta} <span>↗</span>
        </Link>
      </section>
    </main>
  );
}
