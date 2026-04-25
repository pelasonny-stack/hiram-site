import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

const BASE_URL = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  // Block indexing on preview deployments (NODE_ENV=production but VERCEL_ENV !== 'production').
  const isPreview =
    process.env.VERCEL_ENV !== "production" &&
    process.env.NODE_ENV === "production";

  if (isPreview) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
      sitemap: `${BASE_URL}/sitemap.xml`,
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/api/",
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
