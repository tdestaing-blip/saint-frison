import { getEntries, getPageCopy } from "@/lib/content";
import { CatalogCard } from "@/components/catalog-card";
export const metadata = {
  title: "Luminaires",
  description:
    "Luminaires Saint-Frison : pièces textiles, petites séries et développements sur commande.",
};
export default async function Page() {
  const copy = await getPageCopy();
  const entries = await getEntries("lighting");
  return (
    <main id="main">
      <header className="page-intro">
        <div>
          <h1>{copy.lightingTitle}</h1>
          <p>{copy.lightingIntroduction}</p>
        </div>
      </header>
      <section
        className="catalog-section"
        aria-label="Catalogue des luminaires"
      >
        <div className="catalog-grid">
          {entries.map((entry, i) => (
            <CatalogCard key={entry._id} entry={entry} priority={i === 0} />
          ))}
        </div>
        {!entries.length && (
          <p className="empty-note">
            La collection se découvre auprès du studio.
          </p>
        )}
      </section>
    </main>
  );
}
