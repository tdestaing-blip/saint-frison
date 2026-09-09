"use client";
import { useState } from "react";
import Link from "next/link";
import { Photo } from "./photo";
import type { Entry } from "@/lib/types";
const cats = [
  ["all", "Tous les textiles"],
  ["upholstery", "Ameublement"],
  ["voile", "Voiles"],
  ["research", "Recherche textile"],
];
export function Catalog({ entries }: { entries: Entry[] }) {
  const [category, setCategory] = useState("all");
  const filtered = entries.filter(
    (x) => category === "all" || x.category === category,
  );
  return (
    <>
      <div className="filters" role="group" aria-label="Familles textiles">
        {cats.map(([id, label]) => (
          <button
            key={id}
            aria-pressed={category === id}
            onClick={() => setCategory(id)}
          >
            {label}
            <sup>
              {id === "all"
                ? entries.length
                : entries.filter((x) => x.category === id).length}
            </sup>
          </button>
        ))}
      </div>
      <p className="sr-only" role="status">
        {filtered.length} textiles affichés
      </p>
      <div className="catalog-grid">
        {filtered.map((x) => (
          <Link
            key={x.slug}
            href={"/textiles/" + x.slug}
            className="image-card"
          >
            <div className="image-wrap">
              <Photo media={x.heroMedia} />
              <div className="card-overlay">
                <span>{x.title}</span>
                <span>↗</span>
              </div>
            </div>
            <div className="card-caption">
              <h3>{x.title}</h3>
              <span>{cats.find((c) => c[0] === x.category)?.[1]}</span>
            </div>
          </Link>
        ))}
      </div>
      {!filtered.length && (
        <p className="empty-note">
          Cette sélection se découvre directement avec le studio.
        </p>
      )}
    </>
  );
}
