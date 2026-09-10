import { getEntries, getPageCopy } from "@/lib/content";
import { Catalog } from "@/components/catalog";
export const metadata = {
  title: "Textiles",
  description:
    "Une sélection de textiles tissés : ameublement, voiles et tissages d’exception. Collections et développements sur mesure.",
};
export default async function Page() {
  const copy = await getPageCopy();
  return (
    <main id="main">
      <header className="page-intro">
        <p className="eyebrow">{copy.textilesEyebrow}</p>
        <div>
          <h1>
            {copy.textilesTitle === "TEXTILES"
              ? "Textiles"
              : copy.textilesTitle}
          </h1>
          <p>{copy.textilesIntroduction}</p>
        </div>
      </header>
      <section className="catalog-section">
        <Catalog entries={await getEntries("textile")} />
      </section>
    </main>
  );
}
