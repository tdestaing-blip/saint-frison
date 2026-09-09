import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  const indexable = process.env.SITE_INDEXABLE === "true";
  const origin = process.env.SITE_URL;
  return {
    rules: {
      userAgent: "*",
      allow: indexable ? "/" : undefined,
      disallow: indexable ? ["/studio", "/api/", "/privacy"] : ["/"],
    },
    sitemap: indexable && origin ? origin + "/sitemap.xml" : undefined,
  };
}
