import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Internal / product tools — never index from the marketing site.
      disallow: ["/admin", "/panel", "/ingest", "/api/"],
    },
    sitemap: "https://replash.info/sitemap.xml",
  };
}
