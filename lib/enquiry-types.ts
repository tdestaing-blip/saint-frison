export const enquiryTypes = [
  "Échantillon",
  "Informations sur un textile",
  "Luminaire / acquisition",
  "Projet sur mesure",
  "Rendez-vous",
  "Collaboration / presse / autre",
] as const;
export type EnquiryType = (typeof enquiryTypes)[number];
const legacy: Record<string, EnquiryType> = {
  Textile: "Informations sur un textile",
  Pièce: "Luminaire / acquisition",
  "Sur mesure": "Projet sur mesure",
  Collaboration: "Collaboration / presse / autre",
  "Presse / autre": "Collaboration / presse / autre",
};
export function normaliseEnquiryType(value: string): string {
  return legacy[value] || value;
}
export function contactHref(type: EnquiryType, title = "", source = "") {
  return (
    "/contact?" +
    new URLSearchParams({ type, reference: title, source }).toString()
  );
}
