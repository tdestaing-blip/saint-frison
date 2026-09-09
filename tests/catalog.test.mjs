import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
const seed = JSON.parse(
  fs.readFileSync(new URL("../content/seed.json", import.meta.url)),
);
test("every curated page has a unique route and real accessible photographs", () => {
  for (const entries of Object.values(seed)) {
    assert.equal(new Set(entries.map((e) => e.slug)).size, entries.length);
    for (const entry of entries) {
      assert.ok(entry.title);
      assert.ok(entry.heroMedia.alt);
      for (const media of [entry.heroMedia, ...entry.gallery]) {
        assert.ok(
          fs.existsSync(new URL("../public" + media.src, import.meta.url)),
          media.src,
        );
        assert.ok(media.alt.length > 5);
      }
    }
  }
});
test("no unconfirmed lamp stock or price is invented and project references resolve", () => {
  assert.ok(seed.lighting.every((e) => e.status === "selection" && !e.price));
  for (const e of seed.projects)
    for (const slug of e.textileSlugs)
      assert.ok(seed.textiles.find((t) => t.slug === slug));
});
test("linear weights from the provided catalogue retain their units", () => {
  for (const e of seed.textiles.filter((t) => t.weight))
    assert.match(e.weight, /gr\s*\/\s*ml/);
});
