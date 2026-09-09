import { createClient, type QueryParams } from "next-sanity";
import { draftMode } from "next/headers";
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const isSanityConfigured = Boolean(projectId);
export const client = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion: "2026-03-01",
      useCdn: false,
      stega: { studioUrl: "/studio" },
    })
  : null;
export async function sanityQuery<T>(
  query: string,
  params: QueryParams = {},
): Promise<T | null> {
  if (!client) return null;
  const draft = (await draftMode()).isEnabled;
  return client.fetch<T>(query, params, {
    perspective: draft ? "drafts" : "published",
    token: process.env.SANITY_API_READ_TOKEN,
    stega: draft,
    cache: "no-store",
  });
}
