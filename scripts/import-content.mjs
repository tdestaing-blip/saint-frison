import { createClient } from "@sanity/client";
import fs from "node:fs";
import path from "node:path";
const {
  NEXT_PUBLIC_SANITY_PROJECT_ID: projectId,
  SANITY_API_WRITE_TOKEN: token,
} = process.env;
if (!projectId || !token)
  throw new Error(
    "Renseigner le projet Sanity et le jeton d’écriture dans .env.local.",
  );
const client = createClient({
  projectId,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token,
  apiVersion: "2026-03-01",
  useCdn: false,
});
const seed = JSON.parse(fs.readFileSync("content/seed.json", "utf8"));
const uploads = new Map();
async function image(media) {
  if (!media) return undefined;
  if (!uploads.has(media.src)) {
    const asset = await client.assets.upload(
      "image",
      fs.createReadStream(path.join("public", media.src)),
      { filename: path.basename(media.src) },
    );
    uploads.set(media.src, asset._id);
  }
  return {
    _type: "editorialImage",
    asset: { _type: "reference", _ref: uploads.get(media.src) },
    alt: media.alt,
  };
}
for (const collection of Object.values(seed))
  for (const entry of collection) {
    const doc = {
      ...entry,
      slug: { _type: "slug", current: entry.slug },
      heroMedia: await image(entry.heroMedia),
      gallery: await Promise.all(
        entry.gallery.map(async (m, i) => ({
          ...(await image(m)),
          _key: "photo-" + i,
        })),
      ),
    };
    if (entry.colourways)
      doc.colourways = await Promise.all(
        entry.colourways.map(async (c, i) => ({
          ...c,
          _type: "colourway",
          _key: "colour-" + i,
          heroMedia: await image(c.heroMedia),
        })),
      );
    if (entry.contentBlocks)
      doc.contentBlocks = await Promise.all(
        entry.contentBlocks.map(async (b) => ({
          ...b,
          _type: "editorialBlock",
          images: await Promise.all(
            (b.images || []).map(async (m, i) => ({
              ...(await image(m)),
              _key: "image-" + i,
            })),
          ),
        })),
      );
    if (entry.textileSlug) {
      doc.textileReference = {
        _type: "reference",
        _ref: "textile-" + entry.textileSlug,
      };
      delete doc.textileSlug;
    }
    if (entry.textileSlugs) {
      doc.textiles = entry.textileSlugs.map((s, i) => ({
        _type: "reference",
        _key: "textile-" + i,
        _ref: "textile-" + s,
      }));
      delete doc.textileSlugs;
    }
    await client.createIfNotExists(doc);
    console.log("Contenu disponible :", entry.title);
  }
await client.createIfNotExists({
  _id: "siteSettings",
  _type: "siteSettings",
  brandName: "Saint-Frison Textiles",
  studioLocationLabel: "Saint-Ouen / Paris",
  availablePiecesEnabled: false,
});
await client.createIfNotExists({
  _id: "homePage",
  _type: "homePage",
  heroMedia: await image({
    src: "/images/40-1440.webp",
    alt: "Tissage blanc et courbes de rotin",
  }),
  selectedTextiles: ["strata", "meltem", "edgar"].map((s, i) => ({
    _type: "reference",
    _key: "textile-" + i,
    _ref: "textile-" + s,
  })),
  lightingFeature: { _type: "reference", _ref: "lighting-courbes-suspensions" },
  selectedProjects: [
    { _type: "reference", _key: "project-0", _ref: "project-rotin" },
  ],
});
for (const type of ["aboutPage", "contactPage"])
  await client.createIfNotExists({ _id: type, _type: type });
console.log("Import terminé. Les documents existants ont été préservés.");
