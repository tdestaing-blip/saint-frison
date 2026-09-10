import Link from "@/components/site-link";
import { Photo } from "@/components/photo";
import { getPageContent } from "@/lib/content";
import { studioDefaults as defaults } from "@/lib/studio-defaults";
export const metadata = {
  title: "Le studio",
  description:
    "Margaux Saint Frison, designer textile diplômée de Duperré. Recherche sur métier à tisser et textiles sur mesure à Saint-Ouen.",
};
export default async function Page() {
  const c = await getPageContent("aboutPage");
  const steps = c?.processSteps?.length
    ? c.processSteps
    : defaults.processSteps;
  return (
    <main id="main" className="studio-page">
      <section className="about-opening">
        <div>
          <p className="eyebrow">
            {c?.studioEyebrow || defaults.studioEyebrow}
          </p>
          <h1>{c?.studioHeading || defaults.studioHeading}</h1>
          <p className="multiline">
            {c?.studioIntroduction || defaults.studioIntroduction}
          </p>
        </div>
        <Photo
          media={
            c?.heroMedia || {
              src: "/images/254-1440.webp",
              alt: "Insertion du rotin dans la trame textile à l’atelier",
            }
          }
          priority
        />
      </section>
      <section className="process-story">
        <Photo
          media={
            c?.workshopMedia || {
              src: "/images/249-1440.webp",
              alt: "Navette et tissage sur le métier de l’atelier",
            }
          }
        />
        <div>
          <p className="eyebrow">
            {c?.workshopEyebrow || defaults.workshopEyebrow}
          </p>
          <h2>{c?.workshopHeading || defaults.workshopHeading}</h2>
          <p className="multiline">
            {c?.workshopDescription || defaults.workshopDescription}
          </p>
        </div>
      </section>
      <section className="studio-materials">
        <h2 className="eyebrow">
          {c?.materialsHeading || defaults.materialsHeading}
        </h2>
        <p>{c?.materialsDescription || defaults.materialsDescription}</p>
      </section>
      <section className="process-section">
        <p className="eyebrow">
          {c?.processEyebrow || defaults.processEyebrow}
        </p>
        <div className="catalogue-heading">
          <h2>{c?.processHeading || defaults.processHeading}</h2>
        </div>
        <p className="process-introduction">
          {c?.processDescription || defaults.processDescription}
        </p>
        <ol className="process-steps">
          {steps.map((step, i) => (
            <li key={i}>
              <span>0{i + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
        <Link className="text-link" href="/contact?type=Projet%20sur%20mesure">
          {c?.processCta || defaults.processCta} <span>↗</span>
        </Link>
      </section>
    </main>
  );
}
