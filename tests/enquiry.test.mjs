import { test } from "node:test";
import assert from "node:assert/strict";
import { enquirySchema, enquiryEmail } from "../lib/enquiry.ts";
const valid = {
  id: "2e4e65de-eec4-4f6c-a7f4-fc14880dabcb",
  type: "Textile",
  name: "Architecte Test",
  email: "test@example.com",
  message: "Je souhaite découvrir ce textile pour un projet.",
  reference: "Strata",
  sourceUrl: "/textiles/strata",
  consent: true,
};
test("context survives validation and reaches the notification", () => {
  const data = enquirySchema.parse(valid);
  assert.match(enquiryEmail(data), /Strata/);
  assert.match(enquiryEmail(data), /\/textiles\/strata/);
  assert.equal(data.company, "");
});
test("invalid email, missing consent, invalid type and oversized messages are rejected", () => {
  for (const update of [
    { email: "no-email" },
    { consent: false },
    { type: "other" },
    { message: "x".repeat(8001) },
    { name: "" },
    { message: "short" },
  ])
    assert.equal(
      enquirySchema.safeParse({ ...valid, ...update }).success,
      false,
    );
});
