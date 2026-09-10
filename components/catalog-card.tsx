import Link from "@/components/site-link";
import { Photo } from "./photo";
import { textileLabel, projectLabel } from "@/lib/catalogue";
import type { Entry } from "@/lib/types";
export function CatalogCard({
  entry,
  priority = false,
}: {
  entry: Entry;
  priority?: boolean;
}) {
  const prefix =
    entry._type === "textile"
      ? "textiles"
      : entry._type === "lighting"
        ? "lighting"
        : "projects";
  const detail =
    entry._type === "textile"
      ? textileLabel(entry)
      : entry._type === "lighting"
        ? entry.typology
        : projectLabel(entry);
  return (
    <Link
      className="image-card catalogue-card"
      href={"/" + prefix + "/" + entry.slug}
    >
      <div className="image-wrap">
        {entry.heroMedia?.src && (
          <Photo
            media={entry.heroMedia}
            priority={priority}
            sizes="(max-width: 600px) 88vw, (max-width: 1100px) 42vw, 28vw"
          />
        )}
      </div>
      <div className="card-caption">
        <h3>{entry.title}</h3>
        {detail && <p>{detail}</p>}
      </div>
    </Link>
  );
}
