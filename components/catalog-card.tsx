import Link from "@/components/site-link";
import { Photo } from "./photo";
import { availabilityLabels, textileLabel } from "@/lib/catalogue";
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
        : entry.category || entry.location;
  return (
    <Link
      className="image-card catalogue-card"
      href={"/" + prefix + "/" + entry.slug}
    >
      <div className="image-wrap">
        <Photo
          media={entry.heroMedia}
          priority={priority}
          sizes="(max-width: 600px) 88vw, (max-width: 1100px) 42vw, 28vw"
        />
      </div>
      <div className="card-caption">
        <h3>{entry.title}</h3>
        {detail && <p>{detail}</p>}
        {entry._type === "lighting" && (
          <>
            {!!entry.materials?.length && <p>{entry.materials.join(" · ")}</p>}
            {(availabilityLabels[entry.status || ""] || entry.priceLabel) && (
              <p className="availability">
                {[availabilityLabels[entry.status || ""], entry.priceLabel]
                  .filter(Boolean)
                  .join(" — ")}
              </p>
            )}
          </>
        )}
      </div>
    </Link>
  );
}
