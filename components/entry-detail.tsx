"use client";
import { useState } from "react";
import Link from "@/components/site-link";
import { ProductGallery } from "./product-gallery";
import { RelatedEntries } from "./related-entries";
import {
  availabilityLabels,
  textileLabel,
  type RelatedEntry,
} from "@/lib/catalogue";
import { contactHref } from "@/lib/enquiry-types";
import type { Entry } from "@/lib/types";
export function EntryDetail({
  entry,
  type,
  related = [],
}: {
  entry: Entry;
  type: "textile" | "lighting";
  related?: RelatedEntry[];
}) {
  const [selected, setSelected] = useState(0);
  const variant = entry.colourways?.[selected];
  const hero = variant?.heroMedia || entry.heroMedia;
  const images = [hero, ...(entry.gallery || [])].filter(
    (m, i, all) => m?.src && all.findIndex((x) => x?.src === m.src) === i,
  );
  const source =
    "/" + (type === "textile" ? "textiles" : "lighting") + "/" + entry.slug;
  const reference = entry.title + (variant ? " — " + variant.name : "");
  const url = contactHref(
    type === "textile"
      ? "Informations sur un textile"
      : "Luminaire / acquisition",
    reference,
    source,
  );
  const specs = (
    type === "textile"
      ? [
          ["Famille", textileLabel(entry)],
          ["Collection", entry.collection],
          ["Composition", entry.composition],
          ["Laize", entry.width],
          ["Poids", entry.weight],
          ["Usages", entry.applications?.join(" · ")],
          [
            "Coloris",
            entry.colourNames ||
              entry.colourways?.map((c) => c.name).join(" · "),
          ],
          ["Matières", entry.materials?.join(" · ")],
          ["Performances", entry.performance?.join(" · ")],
          ["Minimum de commande", entry.minimumOrder],
          ["Délai", entry.leadTime],
          ["Production", entry.madeToOrder ? "À la commande" : undefined],
          ["Entretien", entry.care],
        ]
      : [
          ["Typologie", entry.typology],
          ["Dimensions", entry.dimensions],
          ["Textile / matériaux", entry.materials?.join(" · ")],
          ["Pied", entry.baseDescription],
          ["Production", entry.productionType],
          ["Disponibilité", availabilityLabels[entry.status || ""]],
          ["Prix", entry.priceLabel],
          ["Informations électriques", entry.electricalInfo],
          ["Douille", entry.socketType],
          ["Ampoule recommandée", entry.recommendedBulb],
          ["Puissance maximale", entry.maxWattage],
          ["Câble", entry.cableDescription],
          ["Pays de fabrication", entry.countryOfManufacture],
          ["Délai", entry.leadTime],
          ["Pied vintage / pièce unique", entry.vintageNote],
        ]
  ).filter(([, value]) => value);
  return (
    <>
      <section className="detail-intro product-intro">
        <ProductGallery key={hero.src} title={entry.title} images={images} />
        <div className="detail-copy">
          <Link
            className="back-link"
            href={type === "textile" ? "/textiles" : "/lighting"}
          >
            ← {type === "textile" ? "Les textiles" : "Les luminaires"}
          </Link>
          <p className="eyebrow">
            {type === "textile"
              ? textileLabel(entry)
              : entry.typology || "Luminaire"}
          </p>
          <h1>{entry.title}</h1>
          <p className="detail-description">{entry.description}</p>
          {type === "lighting" &&
            (entry.priceLabel || availabilityLabels[entry.status || ""]) && (
              <p className="product-availability">
                {[availabilityLabels[entry.status || ""], entry.priceLabel]
                  .filter(Boolean)
                  .join(" — ")}
              </p>
            )}
          {!!entry.colourways?.length && (
            <fieldset className="colourways">
              <legend>Coloris — {variant?.name}</legend>
              {entry.colourways.map((c, i) => (
                <button
                  type="button"
                  key={c.name}
                  onClick={() => setSelected(i)}
                  aria-label={c.name}
                  aria-pressed={selected === i}
                  title={c.name}
                >
                  <span style={{ background: c.swatch || "#ddd" }} />
                </button>
              ))}
            </fieldset>
          )}
          <div className="product-actions">
            <Link className="text-link" href={url}>
              {type === "textile"
                ? "Se renseigner sur ce textile"
                : entry.status === "available"
                  ? "Acquérir cette pièce"
                  : "Se renseigner sur cette pièce"}{" "}
              <span aria-hidden="true">↗</span>
            </Link>
            {type === "textile" && (
              <Link
                className="text-link"
                href={contactHref("Échantillon", reference, source)}
              >
                Demander un échantillon <span aria-hidden="true">↗</span>
              </Link>
            )}
          </div>
        </div>
      </section>
      {!!specs.length && (
        <section className="specs-section">
          <div>
            <p className="eyebrow">FICHE TECHNIQUE</p>
            <h2>
              Informations
              <br />
              <em>{type === "textile" ? "textile." : "luminaire."}</em>
            </h2>
          </div>
          <div>
            <dl>
              {specs.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
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
                Télécharger la fiche technique ↗
              </a>
            )}
            <p className="small-note">
              Les nuances à l’écran peuvent varier. Contactez le studio pour
              découvrir les matières.
            </p>
          </div>
        </section>
      )}
      <RelatedEntries entries={related} />
      {type === "textile" && (
        <section className="bespoke">
          <h2>Un développement sur mesure</h2>
          <p>
            {entry.customisation ||
              "Le studio étudie les adaptations de matières, de couleurs et de structures selon les besoins de votre projet."}
          </p>
          <Link
            className="text-link"
            href={contactHref("Projet sur mesure", reference, source)}
          >
            Parler de votre projet <span aria-hidden="true">↗</span>
          </Link>
        </section>
      )}
    </>
  );
}
