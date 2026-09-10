import Link from "@/components/site-link";
import { Photo } from "@/components/photo";
import { CatalogCard } from "@/components/catalog-card";
import { getEntries, getHome } from "@/lib/content";
import { textileGroup } from "@/lib/catalogue";
import { homeCopy, type HomeCopy } from "@/lib/home-copy";
export default async function Home() {
  const [allTextiles, allLights, content] = await Promise.all([
    getEntries("textile"),
    getEntries("lighting"),
    getHome(),
  ]);
  const copy = Object.fromEntries(
    Object.entries(homeCopy).map(([key, fallback]) => [
      key,
      content.copy?.[key as keyof HomeCopy]?.trim() || fallback,
    ]),
  ) as HomeCopy;
  const textiles = (
    content.selectedTextiles ||
    ["strata", "meltem", "edgar"]
      .map((s) => allTextiles.find((x) => x.slug === s))
      .filter((x) => !!x)
  ).filter((x) => textileGroup(x) === "collection");
  const light = content.lightingFeature || allLights[3] || allLights[0];
  const exception =
    content.exceptionFeature ||
    allTextiles.find((x) => textileGroup(x) === "exception");
  const atelier = content.materialProcessMedia?.[0] || {
    src: "/images/254-1440.webp",
    alt: "Travail du tissage et du rotin à l’atelier Saint Frison",
  };
  const metier = content.materialProcessMedia?.[1] || {
    src: "/images/249-1440.webp",
    alt: "Navette sur le métier à tisser du studio",
  };
  return (
    <main id="main" className="home-v2">
      <section className="hero">
        <Photo
          className="hero-image"
          media={
            content.heroMedia || {
              src: "/images/40-1440.webp",
              alt: "Tissage blanc et courbes de rotin",
            }
          }
          priority
          sizes="100vw"
        />
        <div className="hero-shade" />
        <div className="hero-copy">
          <h1>{copy.heroTitle}</h1>
          <p className="hero-subtitle">{copy.heroSubtitle}</p>
          <p className="hero-description">{copy.heroDescription}</p>
        </div>
      </section>
      <section
        className="section home-collections"
        aria-labelledby="home-collections"
      >
        <div className="home-section-intro">
          <div>
            <p className="eyebrow">TEXTILES</p>
            <h2 id="home-collections">{copy.collectionsTitle}</h2>
          </div>
          <p className="body-copy">{copy.collectionsDescription}</p>
        </div>
        {!!textiles.length && (
          <div className="catalog-grid">
            {textiles.map((entry) => (
              <CatalogCard key={entry._id} entry={entry} />
            ))}
          </div>
        )}
        <Link className="text-link" href="/textiles#family-collection">
          {copy.collectionsCta} <span aria-hidden="true">↗</span>
        </Link>
      </section>
      <section
        className={"home-feature" + (!exception ? " without-image" : "")}
        aria-labelledby="home-exception"
      >
        {exception && (
          <Link
            className="home-feature-image"
            href={"/textiles/" + exception.slug}
            aria-label={exception.title}
          >
            <Photo media={exception.heroMedia} />
          </Link>
        )}
        <div>
          <p className="eyebrow">TISSAGES D’EXCEPTION</p>
          <h2 id="home-exception">{copy.exceptionTitle}</h2>
          <p className="body-copy">{copy.exceptionDescription}</p>
          <Link className="text-link" href="/textiles#family-exception">
            {copy.exceptionCta} <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
      <section
        className={
          "home-feature home-feature-reverse" + (!light ? " without-image" : "")
        }
        aria-labelledby="home-lighting"
      >
        {light && (
          <Link
            className="home-feature-image"
            href={"/lighting/" + light.slug}
            aria-label={light.title}
          >
            <Photo media={light.heroMedia} />
          </Link>
        )}
        <div>
          <p className="eyebrow">LUMINAIRES</p>
          <h2 id="home-lighting">{copy.lightingTitle}</h2>
          <p className="body-copy">{copy.lightingDescription}</p>
          <Link className="text-link" href="/lighting">
            {copy.lightingCta} <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
      <section className="home-feature" aria-labelledby="home-bespoke">
        <div className="home-feature-image">
          <Photo media={atelier} />
        </div>
        <div>
          <p className="eyebrow">SUR MESURE</p>
          <h2 id="home-bespoke">{copy.bespokeTitle}</h2>
          <p className="body-copy">{copy.bespokeDescription}</p>
          <Link
            className="text-link"
            href="/contact?type=Projet%20sur%20mesure"
          >
            {copy.bespokeCta} <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
      <section
        className="home-feature home-feature-reverse"
        aria-labelledby="home-studio"
      >
        <div className="home-feature-image">
          <Photo media={metier} />
        </div>
        <div>
          <p className="eyebrow">LE STUDIO</p>
          <h2 id="home-studio">{copy.studioTitle}</h2>
          <p className="body-copy">{copy.studioDescription}</p>
          <Link className="text-link" href="/about">
            {copy.studioCta} <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
      <section className="contact-closing">
        <h2>{copy.closingTitle}</h2>
        <Link className="text-link" href="/contact">
          {copy.closingCta} <span aria-hidden="true">↗</span>
        </Link>
      </section>
    </main>
  );
}
