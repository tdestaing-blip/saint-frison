import Link from "next/link";
import { availableProducts, formatPrice } from "@/lib/shopify";
export const metadata = {
  title: "Pièces disponibles",
  description:
    "Objets et luminaires Saint-Frison. Une sélection de pièces issues des recherches textiles de l’atelier.",
};
export default async function Page() {
  let products: Awaited<ReturnType<typeof availableProducts>> = [];
  let unavailable = false;
  try {
    products = await availableProducts();
  } catch {
    unavailable = true;
  }
  return (
    <main id="main">
      <header className="page-intro">
        <p className="eyebrow">LES OBJETS DU STUDIO</p>
        <div>
          <h1>Pièces disponibles</h1>
          <p>
            Le prolongement de nos recherches textiles.
            <br />
            Des pièces à faire entrer chez vous.
          </p>
        </div>
      </header>
      {products.length ? (
        <section className="lighting-grid">
          {products.map((p) => (
            <Link
              className="image-card"
              href={"/available-pieces/" + p.handle}
              key={p.id}
            >
              <div className="image-wrap">
                {p.featuredImage && (
                  <img
                    src={p.featuredImage.url}
                    alt={p.featuredImage.altText || p.title}
                    loading="lazy"
                  />
                )}
              </div>
              <div className="card-caption">
                <h3>{p.title}</h3>
                <span>{formatPrice(p.priceRange.minVariantPrice)} ↗</span>
              </div>
            </Link>
          ))}
        </section>
      ) : (
        <section className="pieces-enquiry">
          <div className="pieces-image">
            <img
              src="/images/18-1440.webp"
              alt="Lampe Saint-Frison, tissage sombre et rotin"
            />
          </div>
          <div>
            <p className="eyebrow">UNE PIÈCE VOUS ATTIRE ?</p>
            <h2>Rencontrons-nous.</h2>
            <p>
              {unavailable
                ? "La sélection en ligne est momentanément indisponible. Le studio peut vous renseigner sur les pièces."
                : "Le studio vous renseigne directement sur les pièces et leurs disponibilités."}
            </p>
            <Link className="text-link" href="/contact?type=Pi%C3%A8ce">
              Échanger avec le studio <span>↗</span>
            </Link>
            <Link className="quiet-link" href="/lighting">
              Explorer les luminaires →
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
