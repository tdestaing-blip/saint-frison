import { createClient } from "@sanity/client";
import { writeFile } from "node:fs/promises";
import { studioDefaults } from "../lib/studio-defaults.ts";
const {
  NEXT_PUBLIC_SANITY_PROJECT_ID: projectId,
  SANITY_API_WRITE_TOKEN: token,
} = process.env;
if (!projectId || !token) throw new Error("Configuration Sanity manquante");
const client = createClient({
  projectId,
  token,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-03-01",
  useCdn: false,
});
const docs = await client.fetch(
  '*[_type in ["textile","aboutPage"] && !(_id in path("drafts.**"))]',
);
const changes = [];
for (const doc of docs) {
  if (doc._type === "textile") {
    const rotin = doc.slug?.current === "tissage-rotin";
    const group = rotin
      ? "exception"
      : ["upholstery", "voile"].includes(doc.category)
        ? "collection"
        : doc.category === "research"
          ? "research"
          : undefined;
    if (!group) continue;
    const missing = !doc.textileGroup ? { textileGroup: group } : {};
    const set =
      rotin && doc.category === "research" ? { category: "exception" } : {};
    if (Object.keys(missing).length || Object.keys(set).length)
      changes.push({ doc, missing, set });
  } else {
    const missing = Object.fromEntries(
      Object.entries(studioDefaults).filter(([k]) => doc[k] === undefined),
    );
    if (missing.processSteps)
      missing.processSteps = missing.processSteps.map((s, i) => ({
        ...s,
        _type: "processStep",
        _key: "step-" + i,
      }));
    if (Object.keys(missing).length) changes.push({ doc, missing, set: {} });
  }
}
console.log(
  JSON.stringify(
    changes.map(({ doc, missing, set }) => ({
      id: doc._id,
      fields: [...Object.keys(missing), ...Object.keys(set)],
    })),
  ),
);
if (process.argv.includes("--apply") && changes.length) {
  const backup =
    "/private/tmp/saint-frison-v1-feedback-" + Date.now() + ".json";
  await writeFile(backup, JSON.stringify(changes.map((c) => c.doc)), {
    mode: 0o600,
  });
  let tx = client.transaction();
  for (const { doc, missing, set } of changes)
    tx = tx.patch(doc._id, (p) =>
      p.ifRevisionId(doc._rev).setIfMissing(missing).set(set),
    );
  await tx.commit();
  console.log("Migration terminée. Sauvegarde : " + backup);
}
