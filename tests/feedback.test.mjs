import { test } from "node:test";
import assert from "node:assert/strict";
import { textileGroup, relatedEntries } from "../lib/catalogue.ts";
import { enquirySchema } from "../lib/enquiry.ts";
import { contactHref, enquiryTypes } from "../lib/enquiry-types.ts";
const textile = {
  _id: "t",
  _type: "textile",
  slug: "tissage-rotin",
  title: "Rotin",
  category: "research",
};
const lamp = {
  _id: "l",
  _type: "lighting",
  slug: "lampe",
  title: "Lampe",
  textileSlug: "tissage-rotin",
};
const project = {
  _id: "p",
  _type: "project",
  slug: "projet",
  title: "Projet",
  textileSlugs: ["tissage-rotin"],
  lightingSlugs: ["lampe"],
};
test("exception textile and real research remain separate; explicit editorial choices win", () => {
  assert.equal(textileGroup(textile), "exception");
  assert.equal(textileGroup({ ...textile, slug: "essai" }), "research");
  assert.equal(
    textileGroup({ ...textile, textileGroup: "collection" }),
    "collection",
  );
});
test("associations work in both directions, without missing targets or duplicates", () => {
  const entries = [textile, lamp, project];
  assert.deepEqual(
    relatedEntries(textile, entries).map((e) => e.href),
    ["/lighting/lampe", "/projects/projet"],
  );
  assert.deepEqual(
    relatedEntries(lamp, entries).map((e) => e.href),
    ["/textiles/tissage-rotin", "/projects/projet"],
  );
  assert.deepEqual(
    relatedEntries(project, entries).map((e) => e.href),
    ["/textiles/tissage-rotin", "/lighting/lampe"],
  );
  assert.equal(
    relatedEntries({ ...textile, lightingSlugs: ["lampe", "missing"] }, entries)
      .length,
    2,
  );
});
test("new and legacy contact requests preserve encoded product context", () => {
  const valid = {
    id: "2e4e65de-eec4-4f6c-a7f4-fc14880dabcb",
    name: "Test",
    email: "test@example.com",
    message: "Demande de test pour la recette du formulaire.",
    consent: true,
  };
  for (const type of enquiryTypes)
    assert.equal(enquirySchema.parse({ ...valid, type }).type, type);
  for (const [type, result] of [
    ["Textile", "Informations sur un textile"],
    ["Sur mesure", "Projet sur mesure"],
    ["Pièce", "Luminaire / acquisition"],
    ["Presse / autre", "Collaboration / presse / autre"],
  ])
    assert.equal(enquirySchema.parse({ ...valid, type }).type, result);
  const url = new URL(
    contactHref(
      "Échantillon",
      "Tissage & rotin — Écru",
      "/textiles/tissage-rotin",
    ),
    "https://example.com",
  );
  assert.equal(url.searchParams.get("reference"), "Tissage & rotin — Écru");
  assert.equal(url.searchParams.get("type"), "Échantillon");
});
