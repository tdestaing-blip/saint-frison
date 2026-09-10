"use client";
import { useEffect, useState } from "react";
import type { Entry } from "@/lib/types";
import { textileGroup } from "@/lib/catalogue";
import { CatalogCard } from "./catalog-card";
const filters = [
  ["all", "Tous les textiles"],
  ["upholstery", "Ameublement"],
  ["voile", "Voiles"],
  ["exception", "Tissages d’exception"],
] as const;
export function Catalog({ entries }: { entries: Entry[] }) {
  const [filter, setFilter] = useState<string>("all");
  useEffect(() => {
    const read = () =>
      setFilter(location.hash === "#family-exception" ? "exception" : "all");
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);
  const selection = entries.filter(
    (e) =>
      textileGroup(e) !== "research" &&
      (filter === "all" ||
        (filter === "exception"
          ? textileGroup(e) === "exception"
          : textileGroup(e) === "collection" && e.category === filter)),
  );
  return (
    <>
      <div className="filters" aria-label="Filtrer les textiles">
        {filters.map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>
      <span id="family-collection" className="catalog-anchor" />
      <span id="family-exception" className="catalog-anchor" />
      <p className="sr-only" role="status">
        {selection.length} textile{selection.length > 1 ? "s" : ""}
      </p>
      <div className="catalog-grid">
        {selection.map((entry, i) => (
          <CatalogCard key={entry._id} entry={entry} priority={i === 0} />
        ))}
      </div>
      {!selection.length && (
        <p className="empty-note">
          Cette sélection se découvre auprès du studio.
        </p>
      )}
    </>
  );
}
