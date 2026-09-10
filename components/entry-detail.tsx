"use client";
import { useState } from "react";
import Link from "@/components/site-link";
import { ProductGallery } from "./product-gallery";
import { RelatedEntries } from "./related-entries";
import {
  availabilityLabels,
  lightingPrice,
  textileLabel,
  type RelatedEntry,
} from "@/lib/catalogue";
import { contactHref } from "@/lib/enquiry-types";
import { pageCopy, type PageCopy } from "@/lib/page-copy";
import type { Entry } from "@/lib/types";
export function EntryDetail({
  entry,
  type,
  related = [],
  copy = pageCopy,
}: {
  entry: Entry;
  type: "textile" | "lighting";
  related?: RelatedEntry[];
  copy?: PageCopy;
}) {
  const [selected, setSelected] = useState(0);
  const variant = entry.colourways?.[selected];
  const hero = variant?.heroMedia || entry.heroMedia;
  const images = [
    hero,
    ...(variant?.gallery?.length ? variant.gallery : entry.gallery || []),
  ].filter(
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
  const price = lightingPrice(entry);
  const lightLinks = related.filter((e) => e.kind === "lighting");
  const textileLinks = related.filter((e) => e.kind === "textile");
  const primaryLinks = type === "textile" ? lightLinks : textileLinks;
  const otherLinks = related.filter((e) => !primaryLinks.includes(e));
  const electrical = [
    ["Douille", entry.socketType],
    ["Ampoule recommandée", entry.recommendedBulb],
    ["Puissance maximale", entry.maxWattage],
    ["Câble / interrupteur", entry.cableDescription],
    ["Informations complémentaires", entry.electricalInfo],
  ].filter(([, value]) => value);
  const specs = (
    type === "textile"
      ? [
          ["Composition", entry.composition],
          ["Largeur", entry.width],
          ["Poids", entry.weight],
          ["Usage", entry.applications?.join(" · ")],
          ["Commande minimum", entry.minimumOrder],
          [
            "Production",
            entry.productionType ||
              (entry.madeToOrder ? "À la commande" : undefined),
          ],
          ["Délai indicatif", entry.leadTime],
        ]
      : [
          ["Dimensions", entry.dimensions],
          ["Matériaux", entry.materials?.join(" · ")],
          ["Pied", entry.baseDescription],
          ["Fabrication", entry.productionType],
          ["Délai indicatif", entry.leadTime],
          ["Pays de fabrication", entry.countryOfManufacture],
        ]
  ).filter(([, value]) => value);
  return (
    <>
      <section className="detail-intro product-intro">
        <ProductGallery
          key={entry.slug + "-" + selected}
          title={entry.title}
          images={images}
        />
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
          {type === "lighting" && entry.description && (
            <p className="detail-description">{entry.description}</p>
          )}
          {type === "lighting" &&
            (price || availabilityLabels[entry.status || ""]) && (
              <p className="product-availability">
                {[availabilityLabels[entry.status || ""], price]
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
                ? copy.textileCta
                : entry.status === "sold"
                  ? copy.soldCta
                  : copy.lightingCta}{" "}
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>
      {(!!specs.length ||
        (type === "lighting" && (!!electrical.length || !!entry.vintageNote)) ||
        !!entry.technicalSheet) && (
        <section className="specs-section">
          <div>
            <p className="eyebrow">FICHE TECHNIQUE</p>
            <h2>
              Informations
              <br />
              <em>{type === "textile" ? "textile." : "pièce."}</em>
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
            {type === "lighting" && !!electrical.length && (
              <>
                <h3 className="electrical-heading">Informations électriques</h3>
                <dl>
                  {electrical.map(([label, value]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              </>
            )}
            {type === "lighting" && entry.vintageNote && (
              <p className="vintage-note">{entry.vintageNote}</p>
            )}
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
          </div>
        </section>
      )}
      {type === "textile" && (
        <section className="textile-personalisation">
          <h2 className="eyebrow">{copy.customisationTitle}</h2>
          <p>{entry.customisation || copy.customisationDescription}</p>
        </section>
      )}
      <RelatedEntries
        entries={primaryLinks}
        heading={
          type === "textile"
            ? copy.textileLightingHeading
            : copy.lightingTextileHeading
        }
        cta={
          type === "textile" ? copy.textileLightingCta : copy.lightingTextileCta
        }
      />
      <RelatedEntries entries={otherLinks} />
      {type === "textile" && (
        <section className="bespoke">
          <h2>{copy.textileClosingTitle.replace("{textile}", entry.title)}</h2>
          <p>{copy.textileClosingDescription}</p>
          <Link className="text-link" href={url}>
            {copy.textileCta} <span aria-hidden="true">↗</span>
          </Link>
        </section>
      )}
    </>
  );
}
