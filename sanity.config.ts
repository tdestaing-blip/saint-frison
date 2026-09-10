"use client";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool, defineLocations } from "sanity/presentation";
import { schemaTypes } from "./sanity/schema";
const singletons = [
  ["homePage", "Accueil"],
  ["aboutPage", "Le studio"],
  ["contactPage", "Contact"],
  ["cataloguePage", "Textes des catalogues et fiches"],
  ["siteSettings", "Réglages du site"],
];
export default defineConfig({
  name: "saint-frison",
  title: "Saint-Frison · L’atelier",
  basePath: "/studio",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "unconfigured",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("L’atelier Saint-Frison")
          .items([
            S.listItem()
              .title("Accueil")
              .child(
                S.document().schemaType("homePage").documentId("homePage"),
              ),
            S.divider(),
            S.listItem()
              .title("Textiles")
              .child(
                S.list()
                  .title("Textiles")
                  .items([
                    S.documentTypeListItem("textile").title(
                      "Tous les textiles",
                    ),
                    ...[
                      ["collection", "Collections textiles"],
                      ["exception", "Tissages d’exception"],
                      ["research", "Recherche — à venir"],
                    ].map(([category, title]) =>
                      S.listItem()
                        .title(title)
                        .child(
                          S.documentList()
                            .title(title)
                            .filter(
                              '_type == "textile" && textileGroup == $category',
                            )
                            .params({ category }),
                        ),
                    ),
                  ]),
              ),
            S.documentTypeListItem("lighting").title("Luminaires"),
            S.documentTypeListItem("project").title("Projets"),
            S.divider(),
            S.documentTypeListItem("inquiry").title("Demandes reçues"),
            ...singletons
              .slice(1)
              .map(([type, title]) =>
                S.listItem()
                  .title(title)
                  .child(S.document().schemaType(type).documentId(type)),
              ),
          ]),
    }),
    presentationTool({
      previewUrl: { previewMode: { enable: "/api/draft-mode/enable" } },
      resolve: {
        locations: {
          ...Object.fromEntries(
            [
              ["textile", "textiles"],
              ["lighting", "lighting"],
              ["project", "projects"],
            ].map(([type, path]) => [
              type,
              defineLocations({
                select: { title: "title", slug: "slug.current" },
                resolve: (doc) => ({
                  locations: doc?.slug
                    ? [
                        {
                          title: doc.title || "Voir la page",
                          href: `/${path}/${doc.slug}`,
                        },
                      ]
                    : [],
                }),
              }),
            ]),
          ),
          homePage: defineLocations({
            locations: [{ title: "Accueil", href: "/" }],
          }),
          aboutPage: defineLocations({
            locations: [{ title: "Le studio", href: "/about" }],
          }),
          contactPage: defineLocations({
            locations: [{ title: "Contact", href: "/contact" }],
          }),
        },
      },
    }),
  ],
  schema: { types: schemaTypes },
  document: {
    actions: (actions, context) =>
      context.schemaType === "inquiry"
        ? actions.filter((a) => a.action !== "duplicate")
        : actions,
    newDocumentOptions: (options) =>
      options.filter(
        (o) =>
          !singletons.some(([type]) => type === o.templateId) &&
          o.templateId !== "inquiry" &&
          o.templateId !== "availablePiece",
      ),
  },
});
