import Link from "./site-link";
import type { RelatedEntry } from "@/lib/catalogue";
export function RelatedEntries({ entries }: { entries: RelatedEntry[] }) {
  if (!entries.length) return null;
  return (
    <nav
      className="related-entries"
      aria-label="Matières, luminaires et projets associés"
    >
      {entries.map((e) => (
        <Link key={e.href} className="text-link" href={e.href}>
          {e.kind === "lighting"
            ? "Découvrir le luminaire"
            : e.kind === "textile"
              ? "Découvrir le textile"
              : "Découvrir le projet"}{" "}
          — {e.title} <span aria-hidden="true">↗</span>
        </Link>
      ))}
    </nav>
  );
}
