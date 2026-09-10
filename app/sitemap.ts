import type { MetadataRoute } from "next";
import { getEntries } from "@/lib/content";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = process.env.SITE_URL;
  if (!origin) return [];
  const entries = await Promise.all([
    getEntries("textile"),
    getEntries("lighting"),
    getEntries("project"),
  ]);
  const paths = [
    "/",
    "/textiles",
    "/lighting",
    "/projects",
    "/about",
    "/contact",
    ...entries.flatMap((items, i) =>
      items.map(
        (e) => "/" + ["textiles", "lighting", "projects"][i] + "/" + e.slug,
      ),
    ),
  ];
  return paths.map((path) => ({ url: new URL(path, origin).toString() }));
}
