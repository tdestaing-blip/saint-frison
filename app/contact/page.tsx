import { getSettings, getPageContent } from "@/lib/content";
import { ContactForm } from "@/components/contact-form";
export const metadata = {
  title: "Contact",
  description:
    "Un projet textile, une collaboration, une visite à l’atelier ? Contactez le studio Saint-Frison à Saint-Ouen, Paris.",
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [settings, content, params] = await Promise.all([
    getSettings(),
    getPageContent("contactPage"),
    searchParams,
  ]);
  const value = (k: string) =>
    typeof params[k] === "string" ? (params[k] as string).slice(0, 1000) : "";
  return (
    <main id="main" className="contact-page">
      <section className="contact-intro">
        <p className="eyebrow">OUVRIR LA CONVERSATION</p>
        <h1>
          {content?.title || (
            <>
              Tout commence
              <br />
              <em>par un échange.</em>
            </>
          )}
        </h1>
        <p>
          {content?.description ||
            "Un projet d’architecture intérieure, une matière à développer, une pièce qui vous attire. Nous serons heureux d’en parler avec vous."}
        </p>
        <div className="contact-address">
          <p>{content?.locationLabel || "Paris / Saint-Ouen"}</p>
          <span>{content?.appointmentLabel || "Atelier sur rendez-vous."}</span>
          {settings.professionalEmail && (
            <a href={"mailto:" + settings.professionalEmail}>
              {settings.professionalEmail} ↗
            </a>
          )}
          {settings.instagramUrl && (
            <a href={settings.instagramUrl} target="_blank" rel="noreferrer">
              Instagram ↗
            </a>
          )}
        </div>
      </section>
      <ContactForm
        reference={value("reference")}
        source={value("source")}
        initialType={value("type")}
        email={settings.professionalEmail}
        options={content?.enquiryOptions}
      />
    </main>
  );
}
