import Link from "@/components/site-link";
import { getEntries } from "@/lib/content";
import { CatalogCard } from "@/components/catalog-card";
export const metadata = {
  title: "Luminaires",
  description:
    "Luminaires Saint-Frison : pièces textiles, petites séries et développements sur commande.",
};
export default async function Page() {
  const entries = await getEntries("lighting");
  return (
    <main id="main">
      <header className="page-intro">
        <p className="eyebrow">LES LUMINAIRES DU STUDIO</p>
        <div>
          <h1>Luminaires</h1>
          <p>
            Lampes, appliques et suspensions développées à partir des tissages
            du studio. Pour les disponibilités et les acquisitions,
            contactez-nous.
          </p>
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
      <section className="bespoke">
        <h2>Une pièce pour votre intérieur</h2>
        <p>
          Le studio vous renseigne sur les pièces et les possibilités de
          développement sur commande.
        </p>
        <Link
          className="text-link"
          href="/contact?type=Luminaire%20%2F%20acquisition"
        >
          Contacter le studio <span>↗</span>
        </Link>
      </section>
    </main>
  );
}
