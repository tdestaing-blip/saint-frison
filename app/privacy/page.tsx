import { getSettings } from "@/lib/content";
export const metadata = {
  title: "Confidentialité",
  robots: { index: false, follow: true },
};
export default async function Page() {
  const s = await getSettings();
  return (
    <main id="main" className="privacy-page">
      <p className="eyebrow">VOS DONNÉES</p>
      <h1>Confidentialité</h1>
      <p>
        Le formulaire collecte vos coordonnées, votre message et la référence
        liée à votre demande afin de permettre au studio Saint-Frison de vous
        répondre. L’entreprise et la localisation sont facultatives.
      </p>
      <p>
        Lorsque le service est activé, la demande est enregistrée dans l’espace
        de gestion du studio, hébergé par Sanity, et une notification peut être
        transmise par Resend. Ces données ne sont pas utilisées par ce site pour
        vous inscrire à une newsletter.
      </p>
      <p>
        Le site n’intègre pas de traceur publicitaire. L’espace d’administration
        et le paiement externe peuvent utiliser les cookies nécessaires à leur
        fonctionnement.
      </p>
      {s.professionalEmail && (
        <p>
          Pour une demande relative à vos données, écrivez à{" "}
          <a href={"mailto:" + s.professionalEmail}>{s.professionalEmail}</a>.
        </p>
      )}
      <p className="small-note">
        Cette version de présentation doit être complétée avant l’ouverture au
        public avec l’identité légale de l’éditeur, les coordonnées de contact
        et les durées de conservation validées.
      </p>
    </main>
  );
}
