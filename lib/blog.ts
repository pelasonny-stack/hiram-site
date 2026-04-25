import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import { z } from "zod";

export const blogPostFrontmatterSchema = z.object({
  title: z.string(),
  slug: z.string(),
  publishedAt: z.string(),
  author: z.string(),
  authorRole: z.string().optional(),
  excerpt: z.string(),
  tags: z.array(z.string()).default([]),
  minRead: z.number().int().positive(),
  hero: z
    .object({
      metricLabel: z.string(),
      metricValue: z.string(),
    })
    .optional(),
  seo: z.object({ description: z.string() }).optional(),
});

export type BlogPostFrontmatter = z.infer<typeof blogPostFrontmatterSchema>;

export interface BlogPost {
  frontmatter: BlogPostFrontmatter;
  content: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const files = await fs.readdir(CONTENT_DIR).catch(() => [] as string[]);
  const mdxFiles = files.filter((f) => f.endsWith(".mdx"));
  const posts = await Promise.all(
    mdxFiles.map(async (file) => {
      const raw = await fs.readFile(path.join(CONTENT_DIR, file), "utf-8");
      const { data, content } = matter(raw);
      const frontmatter = blogPostFrontmatterSchema.parse(data);
      return { frontmatter, content };
    }),
  );
  return posts.sort(
    (a, b) =>
      new Date(b.frontmatter.publishedAt).getTime() -
      new Date(a.frontmatter.publishedAt).getTime(),
  );
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPost | null> {
  const all = await getAllBlogPosts();
  return all.find((p) => p.frontmatter.slug === slug) ?? null;
}

export async function getAdjacentBlogPosts(slug: string): Promise<{
  prev: BlogPost | null;
  next: BlogPost | null;
}> {
  const all = await getAllBlogPosts();
  const i = all.findIndex((p) => p.frontmatter.slug === slug);
  if (i === -1) return { prev: null, next: null };
  return {
    prev: i > 0 ? all[i - 1] : null,
    next: i < all.length - 1 ? all[i + 1] : null,
  };
}
