import { pageCopy } from "../lib/page-copy";
import { defaultEnquiryOptions } from "../lib/enquiry-types";
import { homeCopy } from "../lib/home-copy";
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
  field("description", "Présentation courte", "text"),
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
      field("caption", "Légende visible (facultative)"),
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
      gallery,
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
      field("productionType", "Production"),
      field("composition", "Composition"),
      field("width", "Laize"),
      field("weight", "Poids (préciser l’unité)"),
      texts("applications", "Applications"),
      texts("materials", "Matières"),
      defineField({
        name: "performance",
        title: "Performances (historique)",
        type: "array",
        of: [{ type: "string" }],
        hidden: true,
      }),
      field("minimumOrder", "Minimum de commande"),
      field("leadTime", "Délai"),
      field("madeToOrder", "Production à la commande", "boolean"),
      field("customisation", "Personnalisation", "text"),
      defineField({
        name: "care",
        title: "Entretien (historique)",
        type: "text",
        hidden: true,
      }),
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
      field("collection", "Collection"),
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
            { title: "Vendue", value: "sold" },
            { title: "Archive (historique)", value: "archive" },
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
          "Prix avec devise et mention fiscale confirmée (par exemple TTC). Sur commande : le site ajoute « À partir de ». Vendue : le prix est masqué. Laisser vide pour ne pas afficher de prix.",
      }),
      field("electricalInfo", "Informations électriques", "text"),
      field("socketType", "Type de douille"),
      field("recommendedBulb", "Ampoule recommandée"),
      field("maxWattage", "Puissance maximale (avec unité)"),
      field("cableDescription", "Câble et interrupteur"),
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
      ...identity.map((f) =>
        f.name === "heroMedia"
          ? defineField({
              name: "heroMedia",
              title: "Photographie principale",
              type: "editorialImage",
            })
          : f,
      ),
      field("category", "Nature du projet"),
      field("year", "Année"),
      field("location", "Lieu"),
      field("clientOrCollaborator", "Client ou collaboration (si public)"),
      field(
        "credits",
        "Crédits (photographie, architecture intérieure, stylisme…)",
        "text",
      ),
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
      defineField({
        name: "copy",
        title: "Textes de l’accueil",
        type: "object",
        fields: Object.keys(homeCopy).map((name) =>
          defineField({
            name,
            title: (
              {
                heroTitle: "Hero — nom",
                heroSubtitle: "Hero — activité",
                heroDescription: "Hero — présentation",
                collectionsTitle: "Collections — titre",
                collectionsDescription: "Collections — texte",
                collectionsCta: "Collections — lien",
                exceptionTitle: "Tissages d’exception — titre",
                exceptionDescription: "Tissages d’exception — texte",
                exceptionCta: "Tissages d’exception — lien",
                lightingTitle: "Luminaires — titre",
                lightingDescription: "Luminaires — texte",
                lightingCta: "Luminaires — lien",
                bespokeTitle: "Sur mesure — titre",
                bespokeDescription: "Sur mesure — texte",
                bespokeCta: "Sur mesure — lien",
                studioTitle: "Studio — titre",
                studioDescription: "Studio — texte",
                studioCta: "Studio — lien",
                closingTitle: "Fin de page — titre",
                closingCta: "Fin de page — lien",
              } as Record<string, string>
            )[name],
            type: name.endsWith("Description") ? "text" : "string",
          }),
        ),
      }),
      defineField({
        name: "exceptionFeature",
        title: "Tissage d’exception mis en avant",
        type: "reference",
        to: [{ type: "textile" }],
        options: { filter: 'textileGroup == "exception"' },
      }),
      defineField({
        name: "heroLine",
        title: "Ancienne phrase d’ouverture",
        type: "string",
        hidden: true,
      }),
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
      defineField({
        name: "closingContactCopy",
        title: "Ancienne invitation finale",
        type: "string",
        hidden: true,
      }),
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
              field("studioEyebrow", "Surtitre — studio"),
              field("workshopEyebrow", "Surtitre — atelier"),
              field("materialsHeading", "Titre — matières"),
              field("materialsDescription", "Les matières", "text"),
              field("processEyebrow", "Surtitre — sur mesure"),
              field("processDescription", "Introduction — sur mesure", "text"),
              field("processCta", "Lien — sur mesure"),
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
          : [
              field("locationLabel", "Localisation sur Contact"),
              field("appointmentLabel", "Rendez-vous"),
              defineField({
                name: "enquiryOptions",
                title: "Catégories du formulaire",
                type: "array",
                initialValue: defaultEnquiryOptions,
                description:
                  "Modifiez les intitulés et l’ordre, ou ajoutez une catégorie. Conservez les identifiants existants pour les liens des fiches.",
                validation: (r) =>
                  r
                    .min(1)
                    .custom(
                      (options) =>
                        !options ||
                        new Set(
                          options.map((o) => (o as { value?: string }).value),
                        ).size === options.length ||
                        "Chaque catégorie doit avoir un identifiant unique.",
                    ),
                of: [
                  {
                    type: "object",
                    name: "enquiryOption",
                    fields: [
                      required("label", "Intitulé visible"),
                      defineField({
                        name: "value",
                        title: "Identifiant stable",
                        type: "string",
                        validation: (r) => r.required().max(100),
                      }),
                    ],
                    preview: { select: { title: "label", subtitle: "value" } },
                  },
                ],
              }),
            ]),
        defineField({
          name: "heroMedia",
          title: "Photographie",
          type: "editorialImage",
        }),
      ],
    }),
  ),
  defineType({
    name: "cataloguePage",
    title: "Textes des catalogues et fiches",
    type: "document",
    fields: Object.keys(pageCopy).map((name) =>
      defineField({
        name,
        title: (
          {
            textilesEyebrow: "Textiles — surtitre",
            textilesTitle: "Textiles — titre",
            textilesIntroduction: "Textiles — introduction",
            lightingTitle: "Luminaires — titre",
            lightingIntroduction: "Luminaires — introduction",
            projectsTitle: "Projets — titre",
            projectsIntroduction: "Projets — introduction",
            customisationTitle: "Personnalisation — titre",
            customisationDescription: "Personnalisation — texte",
            textileClosingTitle:
              "Fin de fiche textile — titre ({textile} insère le nom)",
            textileClosingDescription: "Fin de fiche textile — texte",
            textileCta: "Textile — lien de renseignement",
            sampleCta: "Textile — lien d’échantillon",
            textileLightingHeading: "Du textile à l’objet — titre",
            textileLightingCta: "Du textile à l’objet — lien",
            lightingTextileHeading: "Textile associé — titre",
            lightingTextileCta: "Textile associé — lien",
            lightingCta: "Luminaire — lien de renseignement",
            soldCta: "Pièce vendue — lien",
            projectCta: "Projet — lien",
          } as Record<string, string>
        )[name],
        type: /Introduction|Description/.test(name) ? "text" : "string",
      }),
    ),
  }),
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
        "typeLabel",
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
              type: "Objet (identifiant)",
              typeLabel: "Objet",
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
