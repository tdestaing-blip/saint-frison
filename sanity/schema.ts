import { defineType, defineField } from "sanity";
const field = (name: string, title: string, type = "string") =>
  defineField({ name, title, type });
const required = (name: string, title: string, type = "string") =>
  defineField({ name, title, type, validation: (r) => r.required() });
const hero = defineField({
  name: "heroMedia",
  title: "Photographie principale",
  type: "editorialImage",
  validation: (r) => r.required(),
});
const gallery = defineField({
  name: "gallery",
  title: "Photographies complémentaires",
  type: "array",
  of: [{ type: "editorialImage" }],
});
const refs = (name: string, title: string, type: string) =>
  defineField({
    name,
    title,
    type: "array",
    of: [{ type: "reference", to: [{ type }] }],
  });
const texts = (name: string, title: string) =>
  defineField({ name, title, type: "array", of: [{ type: "string" }] });
const slug = defineField({
  name: "slug",
  title: "Adresse de la page",
  type: "slug",
  options: { source: "title", maxLength: 80 },
  validation: (r) => r.required(),
});
const order = defineField({
  name: "sortOrder",
  title: "Ordre d’affichage",
  type: "number",
  initialValue: 0,
  description: "Les plus petits nombres apparaissent en premier.",
});
const seo = [
  field("metaTitle", "Titre pour les moteurs de recherche"),
  defineField({
    name: "metaDescription",
    title: "Description pour les moteurs de recherche",
    type: "text",
    rows: 3,
    validation: (r) => r.max(180),
  }),
];
const identity = [
  required("title", "Nom"),
  slug,
  required("description", "Présentation courte", "text"),
  hero,
  gallery,
  order,
];
const preview = { select: { title: "title", media: "heroMedia" } };
export const schemaTypes = [
  defineType({
    name: "editorialImage",
    title: "Photographie",
    type: "image",
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        title: "Description de l’image",
        type: "string",
        description:
          "Décrivez ce que montre la photo. Nécessaire pour les visiteurs utilisant un lecteur d’écran.",
        validation: (r) => r.required(),
      }),
      field("credit", "Crédit photographique"),
    ],
  }),
  defineType({
    name: "colourway",
    title: "Coloris",
    type: "object",
    fields: [
      required("name", "Nom du coloris"),
      field("code", "Référence du coloris"),
      defineField({
        name: "swatch",
        title: "Couleur de la pastille",
        type: "string",
        description: "Code couleur, par exemple #8B7355.",
        validation: (r) =>
          r.regex(/^#[0-9a-fA-F]{6}$/, { name: "couleur hexadécimale" }),
      }),
      defineField({
        name: "heroMedia",
        title: "Photo de ce coloris",
        type: "editorialImage",
      }),
    ],
  }),
  defineType({
    name: "editorialBlock",
    title: "Séquence éditoriale",
    type: "object",
    fields: [
      defineField({
        name: "type",
        title: "Mise en page",
        type: "string",
        initialValue: "full",
        options: {
          list: [
            { title: "Image pleine largeur", value: "full" },
            { title: "Portrait", value: "portrait" },
            { title: "Paysage", value: "landscape" },
            { title: "Deux images", value: "pair" },
            { title: "Image et texte", value: "imageText" },
            { title: "Matière ou geste", value: "process" },
            { title: "Note", value: "note" },
            { title: "Respiration", value: "spacer" },
          ],
        },
        validation: (r) => r.required(),
      }),
      defineField({
        name: "images",
        title: "Images",
        type: "array",
        of: [{ type: "editorialImage" }],
        validation: (r) => r.max(2),
      }),
      field("text", "Texte", "text"),
    ],
    preview: { select: { title: "type", subtitle: "text", media: "images.0" } },
  }),
  defineType({
    name: "textile",
    title: "Textile",
    type: "document",
    fields: [
      ...identity,
      defineField({
        name: "textileGroup",
        title: "Univers textile",
        type: "string",
        initialValue: "collection",
        options: {
          list: [
            { title: "Collections textiles", value: "collection" },
            { title: "Tissages d’exception", value: "exception" },
            { title: "Recherche — espace public à venir", value: "research" },
          ],
        },
        description:
          "Les recherches sont conservées à part des collections commercialisées.",
      }),
      defineField({
        name: "category",
        title: "Famille",
        type: "string",
        options: {
          list: [
            { title: "Ameublement", value: "upholstery" },
            { title: "Voiles", value: "voile" },
            { title: "Tissages d’exception", value: "exception" },
            { title: "Recherche textile", value: "research" },
          ],
        },
        validation: (r) => r.required(),
      }),
      field("internalReference", "Référence interne"),
      field("collection", "Collection"),
      defineField({
        name: "colourways",
        title: "Coloris en images",
        type: "array",
        of: [{ type: "colourway" }],
      }),
      field("colourNames", "Liste des coloris"),
      field("composition", "Composition"),
      field("width", "Laize"),
      field("weight", "Poids (préciser l’unité)"),
      texts("applications", "Applications"),
      texts("materials", "Matières"),
      texts("performance", "Performances vérifiées"),
      field("minimumOrder", "Minimum de commande"),
      field("leadTime", "Délai"),
      field("madeToOrder", "Production à la commande", "boolean"),
      field("customisation", "Personnalisation", "text"),
      field("care", "Entretien", "text"),
      defineField({
        name: "technicalSheet",
        title: "Fiche technique",
        type: "file",
        options: { accept: ".pdf" },
      }),
      refs("projects", "Projets associés", "project"),
      refs("relatedTextiles", "Autres textiles", "textile"),
      refs("relatedLighting", "Luminaires associés", "lighting"),
      ...seo,
    ],
    preview,
    orderings: [
      {
        title: "Ordre choisi",
        name: "manual",
        by: [{ field: "sortOrder", direction: "asc" }],
      },
    ],
  }),
  defineType({
    name: "lighting",
    title: "Luminaire",
    type: "document",
    fields: [
      ...identity,
      field("year", "Année"),
      defineField({
        name: "status",
        title: "Présentation",
        type: "string",
        initialValue: "selection",
        options: {
          list: [
            {
              title: "Sélection — disponibilité non indiquée",
              value: "selection",
            },
            { title: "Disponible à la vente", value: "available" },
            { title: "Sur commande", value: "madeToOrder" },
            { title: "Archive", value: "archive" },
          ],
        },
      }),
      texts("materials", "Matières"),
      texts("technique", "Techniques"),
      field("dimensions", "Dimensions"),
      defineField({
        name: "textileReference",
        title: "Textile associé",
        type: "reference",
        to: [{ type: "textile" }],
      }),
      field("typology", "Typologie (lampe à poser, applique, suspension…)"),
      field("baseDescription", "Pied et matériaux du pied", "text"),
      defineField({
        name: "productionType",
        title: "Mode de production",
        type: "string",
        options: { list: ["Pièce unique", "Petite série", "Sur commande"] },
      }),
      defineField({
        name: "priceLabel",
        title: "Prix à afficher",
        type: "string",
        description:
          "Prix et devise, avec la mention fiscale appropriée si nécessaire. Laisser vide pour ne pas afficher de prix.",
      }),
      field("electricalInfo", "Informations électriques", "text"),
      field("socketType", "Type de douille"),
      field("recommendedBulb", "Ampoule recommandée"),
      field("maxWattage", "Puissance maximale (avec unité)"),
      field("cableDescription", "Longueur et type de câble"),
      field("countryOfManufacture", "Pays de fabrication"),
      field("leadTime", "Délai sur commande"),
      field("vintageNote", "Variations du pied vintage / pièce unique", "text"),
      refs("projects", "Projets associés", "project"),
      defineField({
        name: "shopifyHandle",
        title: "Ancien identifiant Shopify",
        type: "string",
        hidden: true,
      }),
      ...seo,
    ],
    preview,
  }),
  defineType({
    name: "project",
    title: "Projet",
    type: "document",
    fields: [
      ...identity,
      field("category", "Nature du projet"),
      field("year", "Année"),
      field("location", "Lieu"),
      field("clientOrCollaborator", "Client ou collaboration (si public)"),
      field("credits", "Crédits photographiques"),
      texts("applications", "Types d’application"),
      defineField({
        name: "contentBlocks",
        title: "Histoire du projet",
        type: "array",
        of: [{ type: "editorialBlock" }],
        description:
          "Composez la page avec les images disponibles : paires, portraits, détails, texte et respirations.",
      }),
      refs("textiles", "Textiles associés", "textile"),
      refs("lighting", "Luminaires associés", "lighting"),
      ...seo,
    ],
    preview,
  }),
  defineType({
    name: "siteSettings",
    title: "Réglages du site",
    type: "document",
    fields: [
      field("brandName", "Nom du studio"),
      defineField({
        name: "professionalEmail",
        title: "Email professionnel",
        type: "string",
        validation: (r) => r.email(),
      }),
      defineField({
        name: "instagramUrl",
        title: "Instagram",
        type: "url",
        validation: (r) => r.uri({ scheme: ["https"] }),
      }),
      field("studioLocationLabel", "Localisation de l’atelier"),
      defineField({
        name: "availablePiecesEnabled",
        title: "Ancien réglage Shopify",
        type: "boolean",
        hidden: true,
      }),
      ...seo,
    ],
  }),
  defineType({
    name: "homePage",
    title: "Accueil",
    type: "document",
    fields: [
      defineField({
        name: "heroMedia",
        title: "Image d’ouverture",
        type: "editorialImage",
      }),
      field("heroLine", "Phrase d’ouverture"),
      refs("selectedTextiles", "Sélection de textiles", "textile"),
      defineField({
        name: "materialProcessMedia",
        title: "Images de l’atelier",
        type: "array",
        of: [{ type: "editorialImage" }],
      }),
      defineField({
        name: "lightingFeature",
        title: "Luminaire mis en avant",
        type: "reference",
        to: [{ type: "lighting" }],
      }),
      refs("selectedProjects", "Projets mis en avant", "project"),
      field("closingContactCopy", "Invitation finale"),
    ],
  }),
  ...(["aboutPage", "contactPage"] as const).map((name) =>
    defineType({
      name,
      title: name === "aboutPage" ? "Le studio" : "Contact",
      type: "document",
      fields: [
        field("title", "Titre"),
        field("description", "Texte principal", "text"),
        ...(name === "aboutPage"
          ? [
              field("studioHeading", "Titre — présentation du studio"),
              field("studioIntroduction", "Présentation du studio", "text"),
              field("workshopHeading", "Titre — atelier et fabrication"),
              field("workshopDescription", "Atelier et fabrication", "text"),
              defineField({
                name: "workshopMedia",
                title: "Photographie de l’atelier",
                type: "editorialImage",
              }),
              field("processHeading", "Titre — processus sur mesure"),
              defineField({
                name: "processSteps",
                title: "Les quatre étapes",
                type: "array",
                validation: (r) => r.length(4),
                of: [
                  {
                    type: "object",
                    name: "processStep",
                    fields: [
                      required("title", "Titre"),
                      required("text", "Description", "text"),
                    ],
                  },
                ],
              }),
            ]
          : []),
        defineField({
          name: "heroMedia",
          title: "Photographie",
          type: "editorialImage",
        }),
      ],
    }),
  ),
  defineType({
    name: "availablePiece",
    title: "Éditorial d’une pièce Shopify",
    type: "document",
    fields: [
      required("title", "Nom"),
      required("shopifyHandle", "Identifiant du produit Shopify"),
      field("description", "Histoire de la pièce", "text"),
      defineField({
        name: "heroMedia",
        title: "Photographie éditoriale",
        type: "editorialImage",
      }),
      gallery,
      field("dimensions", "Dimensions"),
      texts("materials", "Matières"),
      defineField({
        name: "lighting",
        title: "Luminaire associé",
        type: "reference",
        to: [{ type: "lighting" }],
      }),
      order,
    ],
    description:
      "Le prix, le stock, les variantes et le paiement restent gérés dans Shopify.",
    preview,
  }),
  defineType({
    name: "inquiry",
    title: "Demande reçue",
    type: "document",
    fields: [
      defineField({
        name: "status",
        title: "Suivi",
        type: "string",
        initialValue: "new",
        options: {
          list: [
            { title: "Nouvelle", value: "new" },
            { title: "Répondue", value: "replied" },
            { title: "Archivée", value: "archived" },
          ],
        },
      }),
      ...[
        "name",
        "email",
        "company",
        "location",
        "type",
        "reference",
        "sourceUrl",
        "utm",
        "deliveryStatus",
      ].map((name) =>
        defineField({
          name,
          title: (
            {
              name: "Nom",
              email: "Email",
              company: "Entreprise / studio",
              location: "Localisation",
              type: "Objet",
              reference: "Référence",
              sourceUrl: "Page d’origine",
              utm: "Campagne",
              deliveryStatus: "Notification email",
            } as Record<string, string>
          )[name],
          type: "string",
          readOnly: true,
        }),
      ),
      defineField({
        name: "message",
        title: "Message",
        type: "text",
        readOnly: true,
      }),
      defineField({
        name: "submittedAt",
        title: "Reçue le",
        type: "datetime",
        readOnly: true,
      }),
    ],
    preview: { select: { title: "name", subtitle: "reference" } },
  }),
];
