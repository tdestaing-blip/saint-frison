import { createClient } from "next-sanity";
import { enquirySchema, enquiryEmail } from "@/lib/enquiry";
export async function POST(request: Request) {
  const headers = { "Cache-Control": "no-store" };
  const reply = (data: object, status = 200) =>
    Response.json(data, { status, headers });
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return reply({ error: "Origine non autorisée." }, 403);
  if (!request.headers.get("content-type")?.includes("application/json"))
    return reply({ error: "Format non accepté." }, 415);
  let raw;
  try {
    const body = await request.text();
    if (body.length > 20000)
      return reply({ error: "Message trop volumineux." }, 413);
    raw = JSON.parse(body);
  } catch {
    return reply({ error: "Message invalide." }, 400);
  }
  const parsed = enquirySchema.safeParse(raw);
  if (!parsed.success)
    return reply(
      {
        error:
          "Vérifiez les champs du formulaire : un message de 20 caractères minimum et une adresse email valide sont nécessaires.",
      },
      400,
    );
  const data = parsed.data;
  if (data.website)
    return reply({ error: "La demande n’a pas pu être envoyée." }, 400);
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!projectId || !token)
    return reply(
      {
        error:
          "L’envoi depuis le site n’est pas encore activé. Votre message n’a pas été envoyé.",
      },
      503,
    );
  const c = createClient({
    projectId,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: "2026-03-01",
    useCdn: false,
    token,
  });
  try {
    const existing = await c.getDocument("inquiry-" + data.id);
    if (existing) return reply({ ok: true });
    const digest = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(data.email.toLowerCase()),
    );
    const senderHash = Array.from(new Uint8Array(digest))
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("");
    const recent = await c.fetch<number>(
      'count(*[_type=="inquiry" && senderHash==$hash && submittedAt>$since])',
      { hash: senderHash, since: new Date(Date.now() - 3600000).toISOString() },
    );
    if (recent >= 3)
      return reply(
        {
          error:
            "Plusieurs demandes ont déjà été reçues. Merci de réessayer dans une heure.",
        },
        429,
      );
    const { website: _, consent: __, id, ...fields } = data;
    void _;
    void __;
    const document = {
      _id: "inquiry-" + id,
      _type: "inquiry",
      ...fields,
      senderHash,
      submittedAt: new Date().toISOString(),
      status: "new",
      deliveryStatus: "pending",
    };
    await c.createIfNotExists(document);
    const receiver = process.env.CONTACT_TO_EMAIL;
    const from = process.env.CONTACT_FROM_EMAIL;
    const apiKey = process.env.RESEND_API_KEY;
    if (receiver && from && apiKey) {
      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "Idempotency-Key": `sf-${id}`,
          },
          body: JSON.stringify({
            from,
            to: [receiver],
            reply_to: data.email,
            subject: `Saint-Frison · ${data.type}`,
            text: enquiryEmail(data),
          }),
          signal: AbortSignal.timeout(10000),
        });
        await c
          .patch(document._id)
          .set({ deliveryStatus: res.ok ? "sent" : "failed" })
          .commit();
      } catch {
        await c.patch(document._id).set({ deliveryStatus: "failed" }).commit();
      }
    } else {
      await c
        .patch(document._id)
        .set({ deliveryStatus: "not-configured" })
        .commit();
    }
    return reply({ ok: true });
  } catch {
    return reply(
      {
        error:
          "Nous n’avons pas pu confirmer la réception. Votre texte est conservé dans le formulaire ; vous pouvez réessayer.",
      },
      503,
    );
  }
}
