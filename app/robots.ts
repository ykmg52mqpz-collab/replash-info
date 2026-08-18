import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // This deployment is a development staging copy. The production site lives on
  // replash.eu, so this copy must never be indexed by search engines.
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
  };
}
