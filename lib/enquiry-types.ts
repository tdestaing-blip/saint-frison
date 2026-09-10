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
  "Luminaire ou pièce": "Luminaire / acquisition",
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

export type EnquiryOption = { value: string; label: string };
export const defaultEnquiryOptions: EnquiryOption[] = [
  { value: "Échantillon", label: "Demande d’échantillon" },
  { value: "Informations sur un textile", label: "Textile" },
  { value: "Projet sur mesure", label: "Sur mesure" },
  { value: "Luminaire / acquisition", label: "Luminaire ou pièce" },
  { value: "Rendez-vous", label: "Rendez-vous" },
  { value: "Collaboration / presse / autre", label: "Collaboration" },
  { value: "Presse & autre", label: "Presse & autre" },
];
export function getEnquiryOptions(
  input?: EnquiryOption[] | null,
): EnquiryOption[] {
  if (!Array.isArray(input)) return [...defaultEnquiryOptions];
  const options = input
    .filter(
      (o) =>
        typeof o?.value === "string" &&
        o.value.trim() &&
        typeof o?.label === "string" &&
        o.label.trim(),
    )
    .map((o) => ({ value: o.value.trim(), label: o.label.trim() }));
  return options.length
    ? [...new Map(options.map((o) => [o.value, o])).values()]
    : [...defaultEnquiryOptions];
}
