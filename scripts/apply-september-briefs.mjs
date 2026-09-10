import { isDeepStrictEqual } from "node:util";
import { createClient } from "@sanity/client";
import { writeFile } from "node:fs/promises";
import { studioDefaults } from "../lib/studio-defaults.ts";
import { pageCopy } from "../lib/page-copy.ts";
import { defaultEnquiryOptions } from "../lib/enquiry-types.ts";
const c = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2026-03-01",
  useCdn: false,
});
const docs = await c.fetch(
  '*[_type in ["aboutPage","contactPage","cataloguePage","textile"]]',
);
const changes = [];
for (const doc of docs) {
  let set = {};
  if (doc._type === "aboutPage")
    set = {
      ...studioDefaults,
      processSteps: studioDefaults.processSteps.map((s, i) => ({
        ...s,
        _key: "step-" + i,
        _type: "processStep",
      })),
    };
  if (doc._type === "contactPage")
    set = {
      locationLabel: "Paris / Saint-Ouen",
      appointmentLabel: "Atelier sur rendez-vous.",
      ...(doc.enquiryOptions
        ? {}
        : {
            enquiryOptions: defaultEnquiryOptions.map((o, i) => ({
              ...o,
              _key: "option-" + i,
              _type: "enquiryOption",
            })),
          }),
    };
  if (doc._type === "cataloguePage")
    set = Object.fromEntries(
      Object.entries(pageCopy).filter(([k]) => doc[k] === undefined),
    );
  if (
    doc._type === "textile" &&
    doc.customisation ===
      "Coloris, densité et structure : chaque adaptation fait l’objet d’une étude de faisabilité."
  )
    set = { customisation: pageCopy.customisationDescription };
  set = Object.fromEntries(
    Object.entries(set).filter(([k, v]) => !isDeepStrictEqual(doc[k], v)),
  );
  if (Object.keys(set).length) changes.push({ doc, set });
}
const create = docs.some((d) => d._id === "cataloguePage")
  ? []
  : [{ _id: "cataloguePage", _type: "cataloguePage", ...pageCopy }];
console.log(
  JSON.stringify({
    updates: changes.map(({ doc, set }) => ({
      id: doc._id,
      fields: Object.keys(set),
    })),
    create: create.map((d) => d._id),
  }),
);
if (process.argv.includes("--apply") && (changes.length || create.length)) {
  const backup =
    "/private/tmp/saint-frison-september-briefs-" + Date.now() + ".json";
  await writeFile(
    backup,
    JSON.stringify({
      updated: changes.map((x) => x.doc),
      created: create.map((d) => d._id),
    }),
    { mode: 0o600 },
  );
  let tx = c.transaction();
  for (const { doc, set } of changes)
    tx = tx.patch(doc._id, (p) => p.ifRevisionId(doc._rev).set(set));
  for (const doc of create) tx = tx.createIfNotExists(doc);
  await tx.commit();
  console.log("Contenus mis à jour. Sauvegarde : " + backup);
}
