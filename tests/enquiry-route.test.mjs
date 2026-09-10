import { test } from "node:test";
import assert from "node:assert/strict";
import { registerHooks } from "node:module";
const fakeUrl = new URL("./fixtures/sanity-test-double.mjs", import.meta.url)
  .href;
registerHooks({
  resolve(specifier, context, next) {
    if (
      specifier === "next-sanity" &&
      context.parentURL?.includes("/app/api/enquiries/")
    )
      return { url: fakeUrl, shortCircuit: true };
    if (specifier.startsWith("@/"))
      return next(
        new URL("../" + specifier.slice(2) + ".ts", import.meta.url).href,
        context,
      );
    return next(specifier, context);
  },
});
const { records, settings } = await import("./fixtures/sanity-test-double.mjs");
const { POST } = await import("../app/api/enquiries/route.ts");
const checkout = await import("../app/api/checkout/route.ts");
const valid = {
  id: "2e4e65de-eec4-4f6c-a7f4-fc14880dabcb",
  type: "Échantillon",
  name: "Test recette",
  email: "recette@example.com",
  message: "Demande de test isolée : échantillon Strata pour un projet.",
  reference: "Strata — Limestone",
  sourceUrl: "/textiles/strata",
  consent: true,
};
const request = (data = valid, origin = "https://test.invalid") =>
  new Request("https://test.invalid/api/enquiries", {
    method: "POST",
    headers: { origin, "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
test("contact handler records context in isolated storage, handles retries and rejects invalid requests", async () => {
  const keys = [
    "NEXT_PUBLIC_SANITY_PROJECT_ID",
    "SANITY_API_WRITE_TOKEN",
    "RESEND_API_KEY",
  ];
  const previous = Object.fromEntries(keys.map((k) => [k, process.env[k]]));
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "test-project";
  process.env.SANITY_API_WRITE_TOKEN = "test-token";
  delete process.env.RESEND_API_KEY;
  try {
    assert.equal((await POST(request())).status, 200);
    const record = records.get("inquiry-" + valid.id);
    assert.equal(record.type, "Échantillon");
    assert.equal(record.reference, "Strata — Limestone");
    assert.equal(record.sourceUrl, "/textiles/strata");
    assert.equal(record.status, "new");
    assert.equal(record.deliveryStatus, "not-configured");
    assert.equal((await POST(request())).status, 200);
    assert.equal(records.size, 1);
    settings.enquiryOptions = [
      { value: "visite-pro", label: "Visite professionnelle" },
    ];
    const customId = "1e4e65de-eec4-4f6c-a7f4-fc14880dabcb";
    assert.equal(
      (await POST(request({ ...valid, id: customId, type: "visite-pro" })))
        .status,
      200,
    );
    assert.equal(
      records.get("inquiry-" + customId).typeLabel,
      "Visite professionnelle",
    );
    assert.equal(
      (await POST(request({ ...valid, type: "unknown-category" }))).status,
      400,
    );
    delete settings.enquiryOptions;
    assert.equal(
      (await POST(request(valid, "https://wrong.invalid"))).status,
      403,
    );
    assert.equal(
      (await POST(request({ ...valid, consent: false }))).status,
      400,
    );
    assert.equal((await checkout.POST()).status, 410);
  } finally {
    for (const k of keys) {
      if (previous[k] === undefined) delete process.env[k];
      else process.env[k] = previous[k];
    }
  }
});
