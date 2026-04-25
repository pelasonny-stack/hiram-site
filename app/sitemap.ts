import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { getAllCaseStudies } from "@/lib/case-studies";
import { routing } from "@/i18n/routing";

const BASE_URL = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");

const STATIC_ROUTES: {
  path: string;
  priority: number;
  changeFreq: MetadataRoute.Sitemap[number]["changeFrequency"];
}[] = [
  { path: "", priority: 1.0, changeFreq: "weekly" },
  { path: "/capabilities", priority: 0.8, changeFreq: "monthly" },
  { path: "/case-studies", priority: 0.7, changeFreq: "monthly" },
  { path: "/demo", priority: 0.7, changeFreq: "monthly" },
  { path: "/about", priority: 0.5, changeFreq: "yearly" },
  { path: "/contact", priority: 0.6, changeFreq: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.flatMap((route) =>
    routing.locales.map((locale) => ({
      url: `${BASE_URL}/${locale}${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFreq,
      priority: route.priority,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${BASE_URL}/${l}${route.path}`]),
        ),
      },
    })),
  );

  let caseStudyEntries: MetadataRoute.Sitemap = [];
  try {
    const studies = await getAllCaseStudies();
    caseStudyEntries = studies.flatMap((s) =>
      routing.locales.map((locale) => ({
        url: `${BASE_URL}/${locale}/case-studies/${s.frontmatter.slug}`,
        lastModified: new Date(s.frontmatter.publishedAt),
        changeFrequency: "monthly" as const,
        priority: 0.6,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [
              l,
              `${BASE_URL}/${l}/case-studies/${s.frontmatter.slug}`,
            ]),
          ),
        },
      })),
    );
  } catch {
    /* swallow if content not yet present */
  }

  return [...staticEntries, ...caseStudyEntries];
}
