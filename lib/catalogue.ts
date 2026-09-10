import type { Entry, Media } from "./types";
export function textileGroup(entry: Entry) {
  return (
    entry.textileGroup ||
    (entry.slug === "tissage-rotin"
      ? "exception"
      : entry.category === "research"
        ? "research"
        : "collection")
  );
}
export function textileLabel(entry: Entry) {
  const group = textileGroup(entry);
  if (group === "exception") return "Tissages d’exception";
  if (group === "research") return "Recherche textile";
  return entry.category === "voile"
    ? "Voiles"
    : entry.category === "upholstery"
      ? "Ameublement"
      : "Collections textiles";
}
export const availabilityLabels: Record<string, string> = {
  available: "Disponible",
  madeToOrder: "Sur commande",
  archive: "Archive",
};
export type RelatedEntry = {
  title: string;
  href: string;
  kind: "textile" | "lighting" | "project";
  heroMedia?: Media;
};
export function relatedEntries(entry: Entry, entries: Entry[]): RelatedEntry[] {
  const related = new Map<string, RelatedEntry>();
  const slugs = (e: Entry, kind: string) =>
    kind === "textile"
      ? [
          ...(e.textileSlugs || []),
          ...(e.relatedTextileSlugs || []),
          ...(e.textileSlug ? [e.textileSlug] : []),
        ]
      : kind === "lighting"
        ? e.lightingSlugs || []
        : e.projectSlugs || [];
  for (const candidate of entries) {
    if (candidate._id === entry._id || !candidate.slug || !candidate.title)
      continue;
    if (
      !slugs(entry, candidate._type).includes(candidate.slug) &&
      !slugs(candidate, entry._type).includes(entry.slug)
    )
      continue;
    const kind = candidate._type as RelatedEntry["kind"];
    const prefix = {
      textile: "textiles",
      lighting: "lighting",
      project: "projects",
    }[kind];
    if (!prefix) continue;
    const href = "/" + prefix + "/" + candidate.slug;
    related.set(href, {
      title: candidate.title,
      href,
      kind,
      heroMedia: candidate.heroMedia?.src
        ? candidate.heroMedia
        : candidate.gallery?.find((media) => media.src),
    });
  }
  return [...related.values()];
}
