import Link from "next/link";
import { Photo } from "@/components/photo";
import { getPageContent } from "@/lib/content";
export const metadata = {
  title: "Le studio",
  description:
    "Margaux Saint Frison, designer textile diplômée de Duperré. Recherche sur métier à tisser et textiles sur mesure à Saint-Ouen.",
};
export default async function Page() {
  const c = await getPageContent("aboutPage");
  return (
    <main id="main">
      <section className="about-opening">
        <div>
          <p className="eyebrow">MARGAUX SAINT FRISON</p>
          <h1>
            {c?.title || (
              <>
                Tout commence
                <br />
                <em>par un fil.</em>
              </>
            )}
          </h1>
          <p>
            {c?.description ||
              "Diplômée d’un DMA Tissage à l’École Duperré, Margaux Saint Frison travaille comme responsable d’atelier auprès de Perrine Rousseau avant de créer Saint-Frison Textiles."}
          </p>
          <p>
            À Saint-Ouen, le studio explore la matière sur métier à tisser.
            Laine, lin, soie, papier : chaque recherche met en dialogue la
            structure, la main et la lumière.
          </p>
        </div>
        <Photo
          media={
            c?.heroMedia || {
              src: "/images/254-1440.webp",
              alt: "Le travail de la main — insertion du rotin dans la trame textile",
            }
          }
          priority
        />
      </section>
      <section className="quote-section">
        <p className="eyebrow">UNE PHILOSOPHIE</p>
        <blockquote>
          « Le tissage est une histoire
          <br />
          d’union, de rencontre. »
        </blockquote>
        <p>Margaux Saint Frison</p>
      </section>
      <section className="process-story">
        <Photo
          media={{
            src: "/images/249-1440.webp",
            alt: "Navette et tissage en cours sur le métier de l’atelier",
          }}
        />
        <div>
          <p className="eyebrow">LA MAIN & LA MATIÈRE</p>
          <h2>
            Le temps
            <br />
            <em>de bien faire.</em>
          </h2>
          <p>
            Tout commence par une sélection de fils, une recherche de couleur et
            d’armure. Sur le métier, les essais révèlent une texture, un rythme,
            une transparence.
          </p>
          <p>
            Les collections sont développées à l’atelier. La production au mètre
            est réalisée à la commande avec un atelier partenaire européen, dans
            le respect du savoir-faire artisanal.
          </p>
        </div>
      </section>
      <section className="process-section">
        <div className="section-top">
          <span className="eyebrow">LE SUR-MESURE</span>
          <p>
            Un dialogue,
            <br />
            du premier fil au projet.
          </p>
        </div>
        <ol className="process-steps">
          {[
            [
              "Échanger",
              "Comprendre votre projet, vos usages et vos envies de matière.",
            ],
            [
              "Rechercher",
              "Explorer les fibres, les couleurs et les structures de tissage.",
            ],
            [
              "Échantillonner",
              "Mettre au point la matière et affiner chaque détail ensemble.",
            ],
            [
              "Tisser",
              "Lancer une production à la commande, adaptée à votre projet.",
            ],
          ].map(([title, copy], i) => (
            <li key={title}>
              <span>0{i + 1}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </li>
          ))}
        </ol>
        <Link className="text-link" href="/contact?type=Sur%20mesure">
          Parlons de votre projet <span>↗</span>
        </Link>
      </section>
    </main>
  );
}
