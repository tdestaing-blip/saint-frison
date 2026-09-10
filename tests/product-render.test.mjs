import { test } from "node:test";
import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
const root = new URL("../", import.meta.url);
registerHooks({
  resolve(specifier, context, next) {
    if (
      specifier.startsWith("@/") ||
      (specifier.startsWith(".") &&
        context.parentURL?.startsWith(root.href) &&
        !context.parentURL.includes("/node_modules/"))
    ) {
      const base = specifier.startsWith("@/")
        ? new URL(specifier.slice(2), root)
        : new URL(specifier, context.parentURL);
      for (const suffix of [".tsx", ".ts"]) {
        const url = base.href + suffix;
        if (existsSync(fileURLToPath(url))) return next(url, context);
      }
    }
    return next(specifier, context);
  },
  load(url, context, next) {
    if (
      url.startsWith(root.href) &&
      url.endsWith(".tsx") &&
      !url.includes("/node_modules/")
    ) {
      return {
        format: "module",
        shortCircuit: true,
        source: ts.transpileModule(readFileSync(fileURLToPath(url), "utf8"), {
          compilerOptions: {
            module: ts.ModuleKind.ESNext,
            jsx: ts.JsxEmit.ReactJSX,
            target: ts.ScriptTarget.ES2022,
          },
        }).outputText,
      };
    }
    return next(url, context);
  },
});
const { EntryDetail } = await import("../components/entry-detail.tsx");
const media = { src: "/images/test.webp", alt: "Photographie de test" };
const entry = {
  _id: "test",
  _type: "lighting",
  slug: "test",
  title: "Pièce de test",
  description: "Présentation",
  heroMedia: media,
  gallery: [],
};
test("one photo hides carousel controls, optional lamp specifications remain absent", () => {
  const html = renderToStaticMarkup(
    React.createElement(EntryDetail, { entry, type: "lighting" }),
  );
  assert.doesNotMatch(
    html,
    /Photo suivante|Photo précédente|Choisir une photographie|Douille|Puissance maximale|Acquérir cette pièce/,
  );
  assert.match(html, /Se renseigner sur cette pièce/);
});
test("available lamp uses contact only; a textile colourway supplies its image and contact reference", () => {
  const lamp = renderToStaticMarkup(
    React.createElement(EntryDetail, {
      type: "lighting",
      entry: {
        ...entry,
        status: "available",
        priceLabel: "900 €",
        socketType: "E27",
        gallery: [{ src: "/images/detail.webp", alt: "Détail" }],
      },
    }),
  );
  assert.match(lamp, /Acquérir cette pièce/);
  assert.match(lamp, /900 €/);
  assert.match(lamp, /E27/);
  assert.match(lamp, /Photo suivante/);
  assert.doesNotMatch(lamp, /checkout|available-pieces/);
  const textile = renderToStaticMarkup(
    React.createElement(EntryDetail, {
      type: "textile",
      entry: {
        ...entry,
        _type: "textile",
        category: "voile",
        colourways: [
          {
            name: "Écru",
            heroMedia: { src: "/images/ecru.webp", alt: "Écru" },
          },
        ],
      },
    }),
  );
  assert.match(textile, /\/images\/ecru.webp/);
  assert.match(textile, /Demander un échantillon/);
  assert.match(textile, /reference=Pi%C3%A8ce\+de\+test\+%E2%80%94\+%C3%89cru/);
});
