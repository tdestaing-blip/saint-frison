import Link from "next/link";
import { Photo } from "@/components/photo";
import { getEntries, getHome, categoryLabels } from "@/lib/content";
export default async function Home() {
  const [allTextiles, allLights, allProjects, content] = await Promise.all([
    getEntries("textile"),
    getEntries("lighting"),
    getEntries("project"),
    getHome(),
  ]);
  const textiles =
    content.selectedTextiles ||
    ["strata", "meltem", "edgar"]
      .map((s) => allTextiles.find((x) => x.slug === s))
      .filter((x) => !!x);
  const light = content.lightingFeature || allLights[3] || allLights[0];
  const projects = content.selectedProjects || allProjects.slice(0, 1);
  return (
    <main id="main">
      <section className="hero">
        <Photo
          className="hero-image"
          media={
            content.heroMedia || {
              src: "/images/40-1440.webp",
              alt: "Détail du tissage Saint-Frison, lin blanc et courbes de rotin naturel",
            }
          }
          priority
          sizes="100vw"
        />
        <div className="hero-shade" />
        <div className="hero-copy">
          <p className="eyebrow">STUDIO DE CRÉATION TEXTILE · PARIS</p>
          <h1>
            {content.heroLine || (
              <>
                La matière
                <br />
                <em>prend vie.</em>
              </>
            )}
          </h1>
        </div>
        <Link className="hero-explore" href="/textiles">
          Explorer les textiles <span>↗</span>
        </Link>
        <span className="hero-caption">
          Tissage & rotin — Recherche de l’atelier
        </span>
      </section>
      {textiles.length > 0 && (
        <section className="section">
          <div className="section-top">
            <span className="eyebrow">01 / TEXTILES</span>
            <p>
              Des matières à ressentir.
              <br />
              Des espaces à habiter.
            </p>
          </div>
          <div className="textile-grid">
            {textiles.map((x) => (
              <Link
                className="image-card"
                href={"/textiles/" + x.slug}
                key={x.slug}
              >
                <div className="image-wrap">
                  <Photo media={x.heroMedia} />
                </div>
                <div className="card-caption">
                  <h3>{x.title}</h3>
                  <span>{categoryLabels[x.category || ""]} ↗</span>
                </div>
              </Link>
            ))}
          </div>
          <Link className="text-link" href="/textiles">
            Toute la sélection <span>↗</span>
          </Link>
        </section>
      )}
      <section className="home-studio">
        <div className="home-studio-images">
          <Photo
            className="image-main"
            media={
              content.materialProcessMedia?.[0] || {
                src: "/images/254-1440.webp",
                alt: "Mains au travail sur un tissage et rotin Saint-Frison",
              }
            }
          />
          <Photo
            className="image-detail"
            media={
              content.materialProcessMedia?.[1] || {
                src: "/images/249-1440.webp",
                alt: "La navette sur le métier à tisser",
              }
            }
            sizes="25vw"
          />
        </div>
        <div>
          <p className="eyebrow">02 / LE STUDIO</p>
          <h2>
            Une histoire de fils,
            <br />
            <em>de main et de temps.</em>
          </h2>
          <p className="body-copy">
            À Saint-Ouen, Margaux Saint Frison explore la rencontre des matières
            sur métier à tisser. Des étoffes singulières, pensées pour
            l’architecture intérieure et développées au rythme de chaque projet.
          </p>
          <Link className="text-link" href="/about">
            Entrer dans l’atelier <span>↗</span>
          </Link>
        </div>
      </section>
      {light && (
        <section className="home-lighting">
          <div>
            <p className="eyebrow">03 / LUMINAIRES</p>
            <h2>
              La lumière
              <br />
              <em>comme matière.</em>
            </h2>
            <p className="body-copy">
              Le tissage quitte le plan, devient volume. Les fibres et les
              courbes dessinent une autre façon d’habiter la lumière.
            </p>
            <Link className="text-link" href="/lighting">
              Découvrir les luminaires <span>↗</span>
            </Link>
          </div>
          <Link className="image-card" href={"/lighting/" + light.slug}>
            <div className="image-wrap">
              <Photo media={light.heroMedia} />
            </div>
            <div className="card-caption">
              <h3>{light.title}</h3>
              <span>Textile & rotin ↗</span>
            </div>
          </Link>
        </section>
      )}
      {projects.length > 0 && (
        <section className="home-projects">
          <div className="section-top">
            <span className="eyebrow">04 / PROJETS</span>
            <p>Du fil à l’espace.</p>
          </div>
          {projects.map((p) => (
            <Link
              href={"/projects/" + p.slug}
              key={p.slug}
              className="image-card"
            >
              <div className="image-wrap">
                <Photo media={p.heroMedia} sizes="90vw" />
              </div>
              <div className="card-caption">
                <h3>{p.title}</h3>
                <span>{p.category} ↗</span>
              </div>
            </Link>
          ))}
        </section>
      )}
      <section className="contact-closing">
        <div>
          <p className="eyebrow">SUR-MESURE · PROJETS · COLLABORATIONS</p>
          <h2>
            {content.closingContactCopy || (
              <>
                Une idée, une envie,
                <br />
                <em>un fil à suivre.</em>
              </>
            )}
          </h2>
        </div>
        <Link className="text-link" href="/contact">
          Ouvrir la conversation <span>↗</span>
        </Link>
      </section>
    </main>
  );
}
