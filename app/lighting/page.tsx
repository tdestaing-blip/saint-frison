import Link from "@/components/site-link";
import { getEntries } from "@/lib/content";
import { Photo } from "@/components/photo";
export const metadata = {
  title: "Luminaires",
  description:
    "Le tissage devient lumière. Découvrez les luminaires Saint-Frison, prolongements des recherches textiles du studio.",
};
export default async function Page() {
  const entries = await getEntries("lighting");
  return (
    <main id="main">
      <header className="page-intro">
        <p className="eyebrow">TEXTILE, VOLUME & LUMIÈRE</p>
        <div>
          <h1>Luminaires</h1>
          <p>
            Des objets nés du tissage.
            <br />
            La matière se révèle au contact de la lumière.
          </p>
        </div>
      </header>
      <section className="lighting-grid">
        {entries.map((x, i) => (
          <Link
            className={"image-card lamp-card lamp-" + i}
            href={"/lighting/" + x.slug}
            key={x.slug}
          >
            <div className="image-wrap">
              <Photo media={x.heroMedia} priority={i === 0} />
            </div>
            <div className="card-caption">
              <h3>{x.title}</h3>
              <span>
                {x.status === "archive"
                  ? "Archive"
                  : x.status === "available"
                    ? "Disponible"
                    : "Textile & rotin"}{" "}
                ↗
              </span>
            </div>
          </Link>
        ))}
        {!entries.length && <p>La collection se découvre auprès du studio.</p>}
      </section>
      <section className="bespoke">
        <p className="eyebrow">PIÈCES & DÉVELOPPEMENTS</p>
        <h2>Une lumière singulière.</h2>
        <p>
          Pour découvrir une pièce ou envisager un développement adapté à votre
          intérieur, échangeons.
        </p>
        <Link className="text-link" href="/contact?type=Pi%C3%A8ce">
          Contacter le studio <span>↗</span>
        </Link>
      </section>
    </main>
  );
}
