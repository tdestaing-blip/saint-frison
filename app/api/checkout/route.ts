import { getProduct, shopifyRequest } from "@/lib/shopify";
export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return Response.json({ error: "Origine non autorisée." }, { status: 403 });
  try {
    const { handle, variantId } = (await request.json()) as {
      handle?: unknown;
      variantId?: unknown;
    };
    if (
      typeof handle !== "string" ||
      handle.length > 200 ||
      typeof variantId !== "string" ||
      variantId.length > 200
    )
      return Response.json({ error: "Pièce non valide." }, { status: 400 });
    const product = await getProduct(handle);
    if (
      !product ||
      !product.variants.nodes.some(
        (v) => v.id === variantId && v.availableForSale,
      )
    )
      return Response.json(
        { error: "Cette pièce n’est plus disponible." },
        { status: 409 },
      );
    const result = await shopifyRequest<{
      cartCreate: {
        cart: { checkoutUrl: string } | null;
        userErrors: { message: string }[];
      };
    }>(
      "mutation Checkout($input:CartInput!){cartCreate(input:$input){cart{checkoutUrl} userErrors{message}}}",
      { input: { lines: [{ merchandiseId: variantId, quantity: 1 }] } },
    );
    if (result.cartCreate.userErrors.length || !result.cartCreate.cart)
      return Response.json(
        { error: "Le paiement n’a pas pu être ouvert. Réessayez." },
        { status: 502 },
      );
    const url = new URL(result.cartCreate.cart.checkoutUrl);
    if (url.protocol !== "https:") throw new Error("Invalid checkout URL");
    return Response.json(
      { checkoutUrl: url.toString() },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      {
        error:
          "La boutique est momentanément indisponible. Merci de contacter le studio.",
      },
      { status: 503 },
    );
  }
}
