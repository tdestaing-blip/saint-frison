import { getEntries } from "@/lib/content";
import { Catalog } from "@/components/catalog";
export const metadata = {
  title: "Textiles",
  description:
    "Une sélection de textiles tissés : ameublement, voiles et recherche textile. Collections et développements sur mesure.",
};
export default async function Page() {
  return (
    <main id="main">
      <header className="page-intro">
        <p className="eyebrow">COLLECTIONS & RECHERCHES</p>
        <div>
          <h1>Textiles</h1>
          <p>
            La texture, la structure, la transparence.
            <br />
            Des tissages conçus pour habiter les espaces.
          </p>
        </div>
      </header>
      <section className="catalog-section">
        <Catalog entries={await getEntries("textile")} />
      </section>
      <section className="bespoke">
        <p className="eyebrow">DU FIL AU PROJET</p>
        <h2>
          Une autre couleur.
          <br />
          <em>Une nouvelle histoire.</em>
        </h2>
        <p>
          Le studio développe des textiles sur mesure, en dialogue avec les
          architectes et les décorateurs.
        </p>
        <a className="text-link" href="/contact?type=Sur%20mesure">
          Parlons de votre projet <span>↗</span>
        </a>
      </section>
    </main>
  );
}
