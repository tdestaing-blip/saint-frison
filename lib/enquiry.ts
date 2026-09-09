import { z } from "zod";
export const enquirySchema = z.object({
  id: z.string().uuid(),
  type: z.enum([
    "Sur mesure",
    "Textile",
    "Pièce",
    "Rendez-vous",
    "Collaboration",
    "Presse / autre",
  ]),
  name: z.string().trim().min(2).max(150),
  email: z.string().email().max(254),
  company: z.string().trim().max(200).default(""),
  location: z.string().trim().max(200).default(""),
  message: z.string().trim().min(20).max(8000),
  reference: z.string().max(250).default(""),
  sourceUrl: z.string().max(1000).default(""),
  utm: z.string().max(1000).default(""),
  website: z.string().max(200).default(""),
  consent: z.literal(true),
});
export type EnquiryInput = z.infer<typeof enquirySchema>;
export function enquiryEmail(data: EnquiryInput) {
  return [
    `Nouvelle demande Saint-Frison — ${data.type}`,
    `Nom : ${data.name}`,
    `Email : ${data.email}`,
    `Studio : ${data.company || "—"}`,
    `Lieu : ${data.location || "—"}`,
    `Référence : ${data.reference || "—"}`,
    `Page : ${data.sourceUrl || "—"}`,
    "",
    data.message,
  ].join("\n");
}
