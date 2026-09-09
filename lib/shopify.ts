import { getSettings } from "@/lib/content";
export type Variant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: { amount: string; currencyCode: string };
};
export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  availableForSale: boolean;
  featuredImage?: { url: string; altText?: string };
  images: { nodes: { url: string; altText?: string }[] };
  variants: { nodes: Variant[] };
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
};
const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
export const shopifyConfigured = Boolean(
  domain && token && process.env.SHOPIFY_COLLECTION_HANDLE,
);
const fields = `id handle title description availableForSale featuredImage {url altText} images(first:8){nodes{url altText}} variants(first:100){nodes{id title availableForSale price{amount currencyCode}}} priceRange{minVariantPrice{amount currencyCode}}`;
export async function shopifyRequest<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  if (!domain || !token || !/^[-a-zA-Z0-9]+\.myshopify\.com$/.test(domain))
    throw new Error("Shopify not configured");
  const response = await fetch(`https://${domain}/api/2026-07/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
    signal: AbortSignal.timeout(12000),
  });
  const result = (await response.json()) as { errors?: unknown; data: T };
  if (!response.ok || result.errors || !result.data)
    throw new Error("Shopify unavailable");
  return result.data;
}
export async function availableProducts(): Promise<Product[]> {
  if (!shopifyConfigured) return [];
  const settings = await getSettings();
  if (settings.availablePiecesEnabled === false) return [];
  const result = await shopifyRequest<{
    collection: { products: { nodes: Product[] } } | null;
  }>(
    `query Selection($handle:String!){collection(handle:$handle){products(first:100){nodes{${fields}}}}}`,
    { handle: process.env.SHOPIFY_COLLECTION_HANDLE },
  );
  return (
    result.collection?.products.nodes.filter((p) => p.availableForSale) ?? []
  );
}
export async function getProduct(handle: string) {
  return (await availableProducts()).find((p) => p.handle === handle);
}
export const formatPrice = (value: { amount: string; currencyCode: string }) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: value.currencyCode,
  }).format(Number(value.amount));
