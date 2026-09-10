import type { Entry } from "@/lib/types";
import { textileGroup } from "@/lib/catalogue";
import { CatalogCard } from "./catalog-card";
export function Catalog({ entries }: { entries: Entry[] }) {
  return (
    <>
      {[
        { id: "collection", title: "Collections textiles" },
        { id: "exception", title: "Tissages d’exception" },
      ].map(({ id, title }) => {
        const selection = entries.filter((e) => textileGroup(e) === id);
        return (
          <section
            className="catalogue-family"
            key={id}
            aria-labelledby={"family-" + id}
          >
            <div className="catalogue-heading">
              <h2 id={"family-" + id}>{title}</h2>
              <span>
                {selection.length} textile{selection.length > 1 ? "s" : ""}
              </span>
            </div>
            <div className="catalog-grid">
              {selection.map((entry, i) => (
                <CatalogCard
                  key={entry._id}
                  entry={entry}
                  priority={id === "collection" && i === 0}
                />
              ))}
            </div>
            {!selection.length && (
              <p className="empty-note">
                Cette sélection se découvre auprès du studio.
              </p>
            )}
          </section>
        );
      })}
    </>
  );
}
