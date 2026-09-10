import {
  enquiryTypes,
  normaliseEnquiryType,
  getEnquiryOptions,
  type EnquiryOption,
} from "./enquiry-types.ts";
import { z } from "zod";
export const enquiryFields = z.object({
  id: z.string().uuid(),
  type: z.preprocess(
    (v) => (typeof v === "string" ? normaliseEnquiryType(v) : v),
    z.string().trim().min(1).max(100),
  ),
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
export function createEnquirySchema(options?: EnquiryOption[]) {
  const accepted = new Set([
    ...enquiryTypes,
    ...getEnquiryOptions(options).map((o) => o.value),
  ]);
  return enquiryFields.refine((data) => accepted.has(data.type), {
    path: ["type"],
    message: "Catégorie inconnue",
  });
}
export const enquirySchema = createEnquirySchema();
export type EnquiryInput = z.infer<typeof enquirySchema> & {
  typeLabel?: string;
};
export function enquiryEmail(data: EnquiryInput) {
  return [
    `Nouvelle demande Saint-Frison — ${data.typeLabel || data.type}`,
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
