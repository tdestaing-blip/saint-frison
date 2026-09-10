import Link from "./site-link";
import { Photo } from "./photo";
import type { RelatedEntry } from "@/lib/catalogue";
export function RelatedEntries({ entries }: { entries: RelatedEntry[] }) {
  if (!entries.length) return null;
  return (
    <nav
      className="related-entries"
      aria-label="Matières, luminaires et projets associés"
    >
      <div className="catalog-grid">
        {entries.map((e) => (
          <Link key={e.href} className="image-card catalogue-card" href={e.href}>
            <div className="image-wrap">
              {e.heroMedia && (
                <Photo
                  media={e.heroMedia}
                  sizes="(max-width: 600px) 88vw, (max-width: 1100px) 42vw, 28vw"
                />
              )}
            </div>
            <div className="card-caption">
              <h3>{e.title}</h3>
              <p>
                {e.kind === "lighting"
                  ? "Découvrir le luminaire"
                  : e.kind === "textile"
                    ? "Découvrir le textile"
                    : "Découvrir le projet"}{" "}
                <span aria-hidden="true">↗</span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </nav>
  );
}
