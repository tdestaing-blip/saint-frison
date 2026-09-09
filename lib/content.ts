import { cache } from "react";
import seed from "@/content/seed.json";
import type { Entry, Settings, HomeContent } from "./types";
import { sanityQuery, isSanityConfigured } from "@/sanity/client";
const projection = `{...,"slug":slug.current,"textileSlug":textileReference->slug.current,"textileSlugs":textiles[]->slug.current,"heroMedia":heroMedia{...,"src":asset->url},"gallery":gallery[]{...,"src":asset->url},"colourways":colourways[]{...,"heroMedia":heroMedia{...,"src":asset->url}},"contentBlocks":contentBlocks[]{...,"images":images[]{...,"src":asset->url}},"technicalSheet":technicalSheet.asset->url}`;
export const getEntries = cache(
  async (type: "textile" | "lighting" | "project"): Promise<Entry[]> => {
    if (!isSanityConfigured)
      return (
        type === "textile"
          ? seed.textiles
          : type === "lighting"
            ? seed.lighting
            : seed.projects
      ) as Entry[];
    return (
      (await sanityQuery<Entry[]>(
        `*[_type==$type] | order(sortOrder asc)${projection}`,
        { type },
      )) ?? []
    );
  },
);
export async function getEntry(
  type: "textile" | "lighting" | "project",
  slug: string,
) {
  return (await getEntries(type)).find((x) => x.slug === slug);
}
export const getSettings = cache(async (): Promise<Settings> =>
  isSanityConfigured
    ? ((await sanityQuery<Settings>('*[_type=="siteSettings"][0]')) ?? {})
    : {},
);
export const getHome = cache(async (): Promise<HomeContent> =>
  isSanityConfigured
    ? ((await sanityQuery<HomeContent>(
        `*[_type=="homePage"][0]{...,"heroMedia":heroMedia{...,"src":asset->url},"materialProcessMedia":materialProcessMedia[]{...,"src":asset->url},"selectedTextiles":selectedTextiles[]->${projection},"lightingFeature":lightingFeature->${projection},"selectedProjects":selectedProjects[]->${projection}}`,
      )) ?? {})
    : {},
);
export async function getPageContent(type: "aboutPage" | "contactPage") {
  return isSanityConfigured
    ? await sanityQuery<{
        title?: string;
        description?: string;
        heroMedia?: Entry["heroMedia"];
      }>(
        '*[_type==$type][0]{...,"heroMedia":heroMedia{...,"src":asset->url}}',
        { type },
      )
    : null;
}
export const categoryLabels: Record<string, string> = {
  upholstery: "Ameublement",
  voile: "Voiles",
  research: "Recherche textile",
};
