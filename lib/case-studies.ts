import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import { z } from "zod";

export const caseStudyFrontmatterSchema = z.object({
  title: z.string(),
  slug: z.string(),
  publishedAt: z.string(),
  industry: z.enum(["Telco", "Fintech", "Retail", "Logistics", "Other"]),
  region: z.enum(["LATAM", "EU", "NA", "APAC", "Global"]),
  context: z.string(),
  system: z.string(),
  stack: z.object({
    languages: z.array(z.string()).default([]),
    events: z.array(z.string()).default([]),
    storage: z.array(z.string()).default([]),
    ml: z.array(z.string()).default([]),
    infra: z.array(z.string()).default([]),
  }),
  timeline: z.object({
    rolloutWeeks: z.number(),
    shadowWeeks: z.number().optional(),
  }),
  team: z.string().optional(),
  metrics: z.array(z.object({ label: z.string(), value: z.string() })),
  outcome: z.string(),
  sample: z.boolean().default(true),
  seo: z.object({ description: z.string() }).optional(),
});

export type CaseStudyFrontmatter = z.infer<typeof caseStudyFrontmatterSchema>;

export interface CaseStudy {
  frontmatter: CaseStudyFrontmatter;
  content: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content", "case-studies");

export async function getAllCaseStudies(): Promise<CaseStudy[]> {
  const files = await fs.readdir(CONTENT_DIR).catch(() => [] as string[]);
  const mdxFiles = files.filter((f) => f.endsWith(".mdx"));
  const studies = await Promise.all(
    mdxFiles.map(async (file) => {
      const raw = await fs.readFile(path.join(CONTENT_DIR, file), "utf-8");
      const { data, content } = matter(raw);
      const frontmatter = caseStudyFrontmatterSchema.parse(data);
      return { frontmatter, content };
    }),
  );
  return studies.sort(
    (a, b) =>
      new Date(b.frontmatter.publishedAt).getTime() -
      new Date(a.frontmatter.publishedAt).getTime(),
  );
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  const all = await getAllCaseStudies();
  return all.find((s) => s.frontmatter.slug === slug) ?? null;
}

export async function getAdjacentCaseStudies(slug: string): Promise<{
  prev: CaseStudy | null;
  next: CaseStudy | null;
}> {
  const all = await getAllCaseStudies();
  const i = all.findIndex((s) => s.frontmatter.slug === slug);
  if (i === -1) return { prev: null, next: null };
  return {
    prev: i > 0 ? all[i - 1] : null,
    next: i < all.length - 1 ? all[i + 1] : null,
  };
}
