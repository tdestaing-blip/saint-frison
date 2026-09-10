import { createClient } from "@sanity/client";
import { writeFile } from "node:fs/promises";
const c = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2026-03-01",
  useCdn: false,
});
const docs = await c.fetch(
  '*[_id in ["homePage","cataloguePage","aboutPage","contactPage","textile-strata"]]',
);
const strata = docs.find((d) => d._id === "textile-strata");
if (!strata?.heroMedia?.asset) throw new Error("Image Strata absente");
const updates = [];
for (const doc of docs) {
  let set = {};
  if (doc._id === "homePage")
    set = {
      "copy.heroTitle": "Saint Frison",
      "copy.collectionsTitle": "Les collections",
      heroMedia: strata.heroMedia,
    };
  if (doc._id === "cataloguePage")
    set = {
      textilesTitle: "Textiles",
      lightingTitle: "Luminaires",
      projectsTitle: "Projets",
    };
  if (doc._id === "aboutPage") set = { studioHeading: "Le studio" };
  if (
    doc._id === "contactPage" &&
    !doc.enquiryOptions?.some((o) => o.value === "Échantillon")
  )
    set = {
      enquiryOptions: [
        ...(doc.enquiryOptions || []),
        {
          _key: "sample",
          _type: "enquiryOption",
          value: "Échantillon",
          label: "Demande d’échantillon",
        },
      ],
    };
  if (Object.keys(set).length) updates.push({ doc, set });
}
console.log(
  JSON.stringify(
    updates.map(({ doc, set }) => ({ id: doc._id, fields: Object.keys(set) })),
  ),
);
if (process.argv.includes("--apply")) {
  const backup =
    "/private/tmp/saint-frison-global-design-" + Date.now() + ".json";
  await writeFile(backup, JSON.stringify(updates.map((u) => u.doc)), {
    mode: 0o600,
  });
  let tx = c.transaction();
  for (const { doc, set } of updates)
    tx = tx.patch(doc._id, (p) => p.ifRevisionId(doc._rev).set(set));
  await tx.commit();
  console.log("Contenus mis à jour. Sauvegarde : " + backup);
}
