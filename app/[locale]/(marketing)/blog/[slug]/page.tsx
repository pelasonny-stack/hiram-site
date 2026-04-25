import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { MDXComponents } from "mdx/types";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Eyebrow } from "@/components/marketing/section";
import {
  getAllBlogPosts,
  getAdjacentBlogPosts,
  getBlogPostBySlug,
  type BlogPostFrontmatter,
} from "@/lib/blog";
import { cn } from "@/lib/utils";

export async function generateStaticParams() {
  const all = await getAllBlogPosts();
  return routing.locales.flatMap((locale) =>
    all.map((p) => ({ locale, slug: p.frontmatter.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Post not found" };
  const fm = post.frontmatter;
  const description = fm.seo?.description ?? fm.excerpt;
  return {
    title: `${fm.title} — Hiram`,
    description,
    openGraph: {
      title: fm.title,
      description,
      type: "article",
      publishedTime: fm.publishedAt,
      authors: [fm.author],
    },
    twitter: {
      card: "summary_large_image",
      title: fm.title,
      description,
    },
  };
}

const mdxComponents: MDXComponents = {
  h2: ({ children, ...props }) => {
    const text = typeof children === "string" ? children : "";
    return (
      <h2
        className="text-h2 mt-16 mb-6 scroll-mt-24"
        id={text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")}
        {...props}
      >
        {children}
      </h2>
    );
  },
  h3: ({ children, ...props }) => (
    <h3 className="text-h3 mt-10 mb-4" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }) => (
    <p className="text-foreground-muted leading-relaxed my-5" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }) => (
    <ul
      className="my-5 space-y-2 text-foreground-muted leading-relaxed marker:text-accent list-disc pl-6"
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol
      className="my-5 space-y-2 text-foreground-muted leading-relaxed marker:text-foreground-subtle marker:font-mono list-decimal pl-6"
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="leading-relaxed" {...props}>
      {children}
    </li>
  ),
  strong: ({ children, ...props }) => (
    <strong className="text-foreground font-medium" {...props}>
      {children}
    </strong>
  ),
  a: ({ children, href, ...props }) => (
    <a
      href={href}
      className="text-accent underline-offset-4 hover:underline"
      {...props}
    >
      {children}
    </a>
  ),
  pre: ({ children, ...props }) => (
    <pre
      className="my-6 overflow-x-auto rounded-lg border border-code-border bg-code-bg p-5 text-sm font-mono leading-relaxed"
      {...props}
    >
      {children}
    </pre>
  ),
  code: ({ children, className, ...props }) => {
    const isBlock = className?.includes("language-");
    if (isBlock) {
      return (
        <code className={cn(className, "font-mono")} {...props}>
          {children}
        </code>
      );
    }
    return (
      <code
        className="rounded border border-code-border bg-code-bg px-1.5 py-0.5 font-mono text-[0.9em] text-foreground"
        {...props}
      >
        {children}
      </code>
    );
  },
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="my-6 border-l-2 border-accent pl-5 text-foreground-muted italic"
      {...props}
    >
      {children}
    </blockquote>
  ),
  table: ({ children, ...props }) => (
    <div className="my-6 overflow-x-auto">
      <table
        className="w-full border-collapse text-sm text-foreground-muted"
        {...props}
      >
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead className="border-b border-border text-left" {...props}>
      {children}
    </thead>
  ),
  th: ({ children, ...props }) => (
    <th
      className="px-3 py-2 font-mono text-xs uppercase tracking-wider text-foreground-subtle"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td
      className="border-b border-border/60 px-3 py-2 align-top"
      {...props}
    >
      {children}
    </td>
  ),
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function MetadataRail({
  fm,
  labels,
}: {
  fm: BlogPostFrontmatter;
  labels: {
    publishedOn: string;
    byLine: string;
    minRead: string;
    tags: string;
  };
}) {
  return (
    <aside className="rounded-lg border border-border bg-background-elev/40 p-6 lg:sticky lg:top-24">
      <dl className="space-y-4 text-sm">
        <div>
          <dt className="text-xs text-foreground-subtle uppercase font-mono tracking-wider mb-1">
            {labels.publishedOn}
          </dt>
          <dd className="font-mono text-foreground">
            {formatDate(fm.publishedAt)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-foreground-subtle uppercase font-mono tracking-wider mb-1">
            {labels.byLine}
          </dt>
          <dd className="text-foreground">
            {fm.author}
            {fm.authorRole && (
              <span className="block text-foreground-muted text-xs mt-0.5">
                {fm.authorRole}
              </span>
            )}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-foreground-subtle uppercase font-mono tracking-wider mb-1">
            {labels.minRead}
          </dt>
          <dd className="font-mono text-foreground">{fm.minRead}</dd>
        </div>
        {fm.tags.length > 0 && (
          <div>
            <dt className="text-xs text-foreground-subtle uppercase font-mono tracking-wider mb-2">
              {labels.tags}
            </dt>
            <dd className="flex flex-wrap gap-1.5">
              {fm.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded border border-border bg-background px-2 py-0.5 font-mono text-xs text-foreground"
                >
                  {tag}
                </span>
              ))}
            </dd>
          </div>
        )}
      </dl>
    </aside>
  );
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Blog" });
  const tCase = await getTranslations({ locale, namespace: "CaseStudies" });
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const { prev, next } = await getAdjacentBlogPosts(slug);
  const fm = post.frontmatter;
  const date = formatDate(fm.publishedAt);

  return (
    <article className="pb-20">
      <div className="container-shell pt-10 md:pt-14">
        <Link
          href="/blog"
          className="text-eyebrow text-foreground-subtle hover:text-accent transition-colors"
        >
          {t("back")}
        </Link>
      </div>

      <header className="container-shell pt-10 md:pt-14">
        <div className="max-w-4xl space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <Eyebrow>
              <time dateTime={fm.publishedAt} className="font-mono">
                {date}
              </time>
            </Eyebrow>
            {fm.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {fm.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded border border-border bg-background px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-foreground-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <h1 className="text-h1 max-w-[20ch]">{fm.title}</h1>
          <p className="font-mono text-sm text-foreground-subtle">
            {fm.author}
            {fm.authorRole && ` · ${fm.authorRole}`} · {fm.minRead}{" "}
            {t("minRead")}
          </p>
          {fm.hero && (
            <div className="mt-6 inline-flex items-baseline gap-3 border-l-2 border-accent pl-4">
              <span className="font-mono text-2xl md:text-3xl text-accent font-medium">
                {fm.hero.metricValue}
              </span>
              <span className="font-mono text-xs text-foreground-subtle uppercase tracking-wider">
                {fm.hero.metricLabel}
              </span>
            </div>
          )}
        </div>
      </header>

      <div className="container-shell mt-16 grid gap-12 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-8">
          <MDXRemote source={post.content} components={mdxComponents} />
        </div>
        <div className="lg:col-span-4">
          <MetadataRail
            fm={fm}
            labels={{
              publishedOn: t("publishedOn"),
              byLine: t("byLine"),
              minRead: t("minRead"),
              tags: "Tags",
            }}
          />
        </div>
      </div>

      <div className="container-shell mt-20 grid gap-4 border-t border-border pt-10 sm:grid-cols-2">
        {prev ? (
          <Link
            href={`/blog/${prev.frontmatter.slug}`}
            className="group rounded-lg border border-border bg-background-elev/40 p-5 transition-all hover:border-border-strong"
          >
            <div className="text-eyebrow text-foreground-subtle">
              {tCase("previousCase")}
            </div>
            <div className="mt-2 text-foreground group-hover:text-accent transition-colors">
              {prev.frontmatter.title}
            </div>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/blog/${next.frontmatter.slug}`}
            className="group rounded-lg border border-border bg-background-elev/40 p-5 text-right transition-all hover:border-border-strong sm:col-start-2"
          >
            <div className="text-eyebrow text-foreground-subtle">
              {tCase("nextCase")}
            </div>
            <div className="mt-2 text-foreground group-hover:text-accent transition-colors">
              {next.frontmatter.title}
            </div>
          </Link>
        ) : (
          <div className="sm:col-start-2" />
        )}
      </div>

      <div className="container-shell mt-12">
        <div className="rounded-xl border border-border bg-background-elev/40 p-8 md:p-10 lg:p-12">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div className="space-y-3">
              <h2 className="text-h2">{tCase("ctaTitle")}</h2>
              <p className="max-w-prose text-foreground-muted">
                {tCase("ctaBody")}
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex h-10 items-center justify-center self-start rounded-md bg-accent px-6 text-sm font-medium text-accent-foreground transition-all hover:bg-accent/90 md:self-center"
            >
              {tCase("ctaButton")}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
