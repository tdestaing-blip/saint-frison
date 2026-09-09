"use client";
import { useState } from "react";
import Link from "next/link";
import { Photo } from "./photo";
import type { Entry } from "@/lib/types";
export function EntryDetail({
  entry,
  type,
}: {
  entry: Entry;
  type: "textile" | "lighting";
}) {
  const [selected, setSelected] = useState(-1);
  const image =
    selected >= 0
      ? entry.colourways?.[selected]?.heroMedia || entry.heroMedia
      : entry.heroMedia;
  const label =
    type === "textile"
      ? entry.category === "voile"
        ? "Voile"
        : entry.category === "research"
          ? "Recherche textile"
          : "Ameublement"
      : "Luminaire";
  const specs = [
    ["Collection", entry.collection],
    ["Composition", entry.composition],
    ["Laize", entry.width],
    ["Poids linéaire", entry.weight],
    ["Applications", entry.applications?.join(" · ")],
    ["Coloris", entry.colourNames],
    ["Matières", entry.materials?.join(" · ")],
    ["Dimensions", entry.dimensions],
    ["Performances", entry.performance?.join(" · ")],
    ["Minimum de commande", entry.minimumOrder],
    ["Délai", entry.leadTime],
    ["Production", entry.madeToOrder ? "À la commande" : undefined],
    ["Entretien", entry.care],
  ].filter(([, v]) => v);
  const url =
    "/contact?type=" +
    encodeURIComponent(type === "textile" ? "Textile" : "Pièce") +
    "&reference=" +
    encodeURIComponent(entry.title) +
    "&source=" +
    encodeURIComponent(
      "/" + (type === "textile" ? "textiles" : "lighting") + "/" + entry.slug,
    );
  return (
    <>
      <section className="detail-intro">
        <div className="detail-photo">
          <Photo media={image} priority />
        </div>
        <div className="detail-copy">
          <Link
            className="back-link"
            href={type === "textile" ? "/textiles" : "/lighting"}
          >
            ← {type === "textile" ? "Les textiles" : "Les luminaires"}
          </Link>
          <p className="eyebrow">
            {label}
            {entry.year ? " / " + entry.year : ""}
          </p>
          <h1>{entry.title}</h1>
          <p className="detail-description">{entry.description}</p>
          {!!entry.colourways?.length && (
            <fieldset className="colourways">
              <legend>
                Coloris —{" "}
                {selected >= 0
                  ? entry.colourways[selected].name
                  : entry.colourways[0].name}
              </legend>
              {entry.colourways.map((c, i) => (
                <button
                  key={c.name}
                  onClick={() => setSelected(i)}
                  aria-label={c.name}
                  aria-pressed={i === (selected < 0 ? 0 : selected)}
                  title={c.name}
                >
                  <span style={{ background: c.swatch || "#ddd" }} />
                </button>
              ))}
            </fieldset>
          )}
          <Link className="text-link" href={url}>
            {type === "textile"
              ? "Se renseigner sur ce textile"
              : "Se renseigner sur cette pièce"}{" "}
            <span>↗</span>
          </Link>
          {entry.status === "archive" && (
            <p className="archive-note">Pièce d’archive</p>
          )}
          {entry.status === "available" && entry.shopifyHandle && (
            <Link
              className="text-link"
              href={"/available-pieces/" + entry.shopifyHandle}
            >
              Voir la pièce disponible ↗
            </Link>
          )}
        </div>
      </section>
      {entry.gallery?.length > 0 && (
        <section className="detail-gallery">
          {entry.gallery.map((m, i) => (
            <figure
              key={m.src}
              className={i === 0 && entry.gallery.length % 2 ? "wide" : ""}
            >
              <Photo media={m} />
              <figcaption>{m.alt}</figcaption>
            </figure>
          ))}
        </section>
      )}
      {!!specs.length && (
        <section className="specs-section">
          <div>
            <span className="eyebrow">LA MATIÈRE EN DÉTAIL</span>
            <h2>
              Informations
              <br />
              <em>professionnelles.</em>
            </h2>
          </div>
          <div>
            <dl>
              {specs.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            {entry.technicalSheet && (
              <a
                className="text-link"
                href={entry.technicalSheet}
                target="_blank"
                rel="noreferrer"
              >
                Fiche technique ↗
              </a>
            )}
            <p className="small-note">
              Les nuances à l’écran peuvent varier. Le studio vous accompagne
              dans le choix des matières et des coloris.
            </p>
          </div>
        </section>
      )}
      {type === "textile" && (
        <section className="bespoke">
          <p className="eyebrow">UNE MATIÈRE, VOTRE PROJET</p>
          <h2>Imaginer ensemble.</h2>
          <p>
            {entry.customisation ||
              "Un dialogue autour des matières, des couleurs et des structures, pour donner forme à un textile singulier."}
          </p>
          <Link className="text-link" href={url}>
            Parlons de votre projet <span>↗</span>
          </Link>
        </section>
      )}
      {entry.textileSlug && (
        <div className="related-line">
          <Link className="text-link" href={"/textiles/" + entry.textileSlug}>
            Découvrir la recherche textile associée <span>↗</span>
          </Link>
        </div>
      )}
    </>
  );
}
