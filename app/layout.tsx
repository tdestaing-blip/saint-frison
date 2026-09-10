import type { Metadata } from "next";
import Link from "@/components/site-link";
import { Header } from "@/components/header";
import "./globals.css";
import "./design-system.css";
import { draftMode } from "next/headers";
import { Preview } from "@/sanity/preview";
import { projectId, dataset } from "@/sanity/client";
import { getSettings } from "@/lib/content";
export const metadata: Metadata = {
  title: {
    default: "Saint-Frison Textiles — Studio de création textile",
    template: "%s — Saint-Frison Textiles",
  },
  description:
    "Textiles tissés pour l’architecture intérieure, luminaires et développements sur mesure. Le studio de Margaux Saint Frison à Saint-Ouen, Paris.",
  icons: { icon: "/images/symbol.png" },
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  const draft = (await draftMode()).isEnabled;
  return (
    <html lang="fr">
      <body className="sf-site">
        <a className="skip-link" href="#main">
          Aller au contenu
        </a>
        <Header />
        {children}
        {draft && projectId && (
          <Preview projectId={projectId} dataset={dataset} />
        )}
        <footer className="site-footer">
          <Link href="/" className="footer-brand">
            <img
              src="/images/wordmark.png"
              alt="Saint-Frison Textiles"
              width="250"
              height="80"
            />
          </Link>
          <p>
            Studio de création textile
            <br />
            {settings.studioLocationLabel || "Saint-Ouen / Paris"}
          </p>
          <div>
            <Link href="/contact">À l’atelier, sur rendez-vous ↗</Link>
            <Link href="/about">Matières, gestes & savoir-faire</Link>
            {settings.professionalEmail && (
              <a href={"mailto:" + settings.professionalEmail}>
                {settings.professionalEmail}
              </a>
            )}
            {settings.instagramUrl && (
              <a href={settings.instagramUrl} target="_blank" rel="noreferrer">
                Instagram ↗
              </a>
            )}
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Saint-Frison Textiles</span>
            <Link href="/privacy">Confidentialité</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
