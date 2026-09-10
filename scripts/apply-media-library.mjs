import { createClient } from "@sanity/client";
import { readFile, writeFile } from "node:fs/promises";
import { createReadStream } from "node:fs";
import path from "node:path";

// Exact selection from Margaux's September library. Assets and previous content
// are retained; only the selected media fields and new catalogue entries change.
const manifest = JSON.parse(
  await readFile("content/image-selection-2026-09.json", "utf8"),
);
const sourceRoot = process.env.MEDIA_LIBRARY_ROOT;
const apply = process.argv.includes("--apply");
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2026-03-01",
  useCdn: false,
});
const ids = [
  ...Object.keys(manifest.patches),
  ...manifest.newEntries.map((e) => e._id),
  "homePage",
  "aboutPage",
];
const docs = await client.fetch("*[_id in $ids]", { ids });
const byId = new Map(docs.map((d) => [d._id, d]));
for (const id of Object.keys(manifest.patches))
  if (!byId.has(id)) throw new Error("Document absent : " + id);
console.log(
  JSON.stringify({
    selectedImages: Object.keys(manifest.assets).length,
    updatedEntries: Object.keys(manifest.patches),
    newEntries: manifest.newEntries.map((e) => e.title),
  }),
);
if (!apply) process.exit(0);
if (!sourceRoot)
  throw new Error("MEDIA_LIBRARY_ROOT must point to the extracted library.");
const backup = "/private/tmp/saint-frison-before-media-" + Date.now() + ".json";
await writeFile(backup, JSON.stringify(docs, null, 2), { mode: 0o600 });
const uploaded = new Map();
const queue = Object.values(manifest.assets);
// Uploads are independent and deduplicated by Sanity's asset hash.
await Promise.all(
  Array.from({ length: 3 }, async () => {
    while (queue.length) {
      const asset = queue.shift();
      const file = path.resolve(sourceRoot, asset.source);
      if (!file.startsWith(path.resolve(sourceRoot) + path.sep))
        throw new Error("Invalid source path");
      const result = await client.assets.upload(
        "image",
        createReadStream(file),
        { filename: path.basename(file) },
      );
      uploaded.set("/images/" + asset.basename + "-1440.webp", result._id);
    }
  }),
);
function image(m, key) {
  const ref = uploaded.get(m.src);
  if (!ref) throw new Error("Missing image " + m.src);
  return {
    _type: "editorialImage",
    ...(key ? { _key: key } : {}),
    asset: { _type: "reference", _ref: ref },
    alt: m.alt,
    ...(m.hotspot ? { hotspot: m.hotspot } : {}),
  };
}
const gallery = (arr) => arr.map((m, i) => image(m, "library-" + i));
function mediaFields(p) {
  return { heroMedia: image(p.heroMedia), gallery: gallery(p.gallery) };
}
let tx = client.transaction();
for (const entry of manifest.newEntries) {
  const { textileSlug, ...fields } = entry;
  const doc = {
    ...fields,
    slug: { _type: "slug", current: entry.slug },
    ...mediaFields(entry),
  };
  if (textileSlug)
    doc.textileReference = {
      _type: "reference",
      _ref: "textile-" + textileSlug,
    };
  // Do not overwrite a record edited after an earlier application of this selection.
  tx = tx.createIfNotExists(doc);
}
for (const [id, p] of Object.entries(manifest.patches)) {
  const d = byId.get(id),
    set = mediaFields(p);
  if (p.variantMedia)
    set.colourways = (d.colourways || []).map((v) => ({
      ...v,
      ...(p.variantMedia[v.name] ? mediaFields(p.variantMedia[v.name]) : {}),
    }));
  tx = tx.patch(id, (p) => p.ifRevisionId(d._rev).set(set));
}
const home = byId.get("homePage"),
  about = byId.get("aboutPage");
if (!home || !about) throw new Error("Missing editorial page");
tx = tx.patch(home._id, (p) =>
  p
    .ifRevisionId(home._rev)
    .set({
      heroMedia: image(manifest.editorial.home.heroMedia),
      materialProcessMedia: gallery(
        manifest.editorial.home.materialProcessMedia,
      ),
      lightingFeature: {
        _type: "reference",
        _ref: "lighting-" + manifest.homeLighting,
      },
      exceptionFeature: {
        _type: "reference",
        _ref: "textile-" + manifest.homeException,
      },
    }),
);
tx = tx.patch(about._id, (p) =>
  p
    .ifRevisionId(about._rev)
    .set({
      heroMedia: image(manifest.editorial.about.heroMedia),
      workshopMedia: image(manifest.editorial.about.workshopMedia),
    }),
);
await tx.commit();
console.log("Médiathèque mise à jour. Sauvegarde : " + backup);
