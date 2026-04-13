import type { MetadataRoute } from "next";

import { buildAbsoluteUrl } from "@/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      allow: "/",
      userAgent: "*",
    },
    sitemap: buildAbsoluteUrl("/sitemap.xml"),
  };
}
