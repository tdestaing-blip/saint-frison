import Link from "@/components/site-link";
import { isSanityConfigured } from "@/sanity/client";
import StudioClient from "@/components/studio-client";
export const metadata = {
  title: "L’atelier — Administration",
  robots: { index: false, follow: false },
};
export default function StudioPage() {
  return (
    <main id="main" className="studio-root">
      {isSanityConfigured ? (
        <StudioClient />
      ) : (
        <div className="studio-setup">
          <img
            src="/images/wordmark.png"
            alt="Saint-Frison Textiles"
            width="260"
          />
          <p className="eyebrow">L’ESPACE ÉDITORIAL DE MARGAUX</p>
          <h1>
            Votre atelier
            <br />
            <em>en ligne.</em>
          </h1>
          <p>
            L’espace de gestion est prêt à être relié à votre compte Sanity.
            Cette connexion est nécessaire pour modifier et publier les
            contenus.
          </p>
          <p>
            Une fois le compte connecté, retrouvez vos textiles, luminaires,
            projets, images et demandes professionnelles dans un seul espace.
          </p>
          <Link className="text-link" href="/">
            Retour au site <span>↗</span>
          </Link>
        </div>
      )}
    </main>
  );
}
