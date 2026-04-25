import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { MDXComponents } from "mdx/types";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Eyebrow } from "@/components/marketing/section";
import {
  getAllCaseStudies,
  getAdjacentCaseStudies,
  getCaseStudyBySlug,
  type CaseStudyFrontmatter,
} from "@/lib/case-studies";
import { cn } from "@/lib/utils";

export async function generateStaticParams() {
  const all = await getAllCaseStudies();
  return routing.locales.flatMap((locale) =>
    all.map((s) => ({ locale, slug: s.frontmatter.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = await getCaseStudyBySlug(slug);
  if (!study) return { title: "Case study not found" };
  const fm = study.frontmatter;
  const description = fm.seo?.description ?? fm.outcome;
  return {
    title: `${fm.title} — Hiram`,
    description,
    openGraph: {
      title: fm.title,
      description,
      type: "article",
      publishedTime: fm.publishedAt,
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
        id={text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}
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
};

function MetricStrip({ metrics }: { metrics: CaseStudyFrontmatter["metrics"] }) {
  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-3 sm:gap-4 border-t border-border pt-8">
      {metrics.map((m) => (
        <div key={m.label} className="space-y-1.5">
          <div className="font-mono text-2xl md:text-3xl font-medium text-accent">
            {m.value}
          </div>
          <div className="text-xs text-foreground-subtle uppercase tracking-wider font-mono">
            {m.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function MetadataRail({
  fm,
  labels,
}: {
  fm: CaseStudyFrontmatter;
  labels: {
    rolloutWeeks: string;
    shadowWeeks: string;
    team: string;
    languages: string;
    events: string;
    storage: string;
    ml: string;
    infra: string;
  };
}) {
  const stackEntries: Array<[string, string[]]> = [
    [labels.languages, fm.stack.languages],
    [labels.events, fm.stack.events],
    [labels.storage, fm.stack.storage],
    [labels.ml, fm.stack.ml],
    [labels.infra, fm.stack.infra],
  ].filter(([, v]) => v.length > 0) as Array<[string, string[]]>;

  return (
    <aside className="rounded-lg border border-border bg-background-elev/40 p-6 lg:sticky lg:top-24">
      <div className="space-y-6 text-sm">
        <div>
          <dl className="space-y-2">
            <div className="flex justify-between gap-3">
              <dt className="text-foreground-muted">{labels.rolloutWeeks}</dt>
              <dd className="font-mono text-foreground">
                {fm.timeline.rolloutWeeks}
              </dd>
            </div>
            {fm.timeline.shadowWeeks !== undefined && (
              <div className="flex justify-between gap-3">
                <dt className="text-foreground-muted">{labels.shadowWeeks}</dt>
                <dd className="font-mono text-foreground">
                  {fm.timeline.shadowWeeks}
                </dd>
              </div>
            )}
            {fm.team && (
              <div className="flex justify-between gap-3">
                <dt className="text-foreground-muted">{labels.team}</dt>
                <dd className="font-mono text-foreground text-right">
                  {fm.team}
                </dd>
              </div>
            )}
          </dl>
        </div>

        <div className="border-t border-border pt-5">
          <dl className="space-y-3">
            {stackEntries.map(([label, items]) => (
              <div key={label}>
                <dt className="text-xs text-foreground-subtle uppercase font-mono tracking-wider mb-1">
                  {label}
                </dt>
                <dd className="flex flex-wrap gap-1.5">
                  {items.map((it) => (
                    <span
                      key={it}
                      className="inline-flex items-center rounded border border-border bg-background px-2 py-0.5 font-mono text-xs text-foreground"
                    >
                      {it}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </aside>
  );
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "CaseStudies" });
  const study = await getCaseStudyBySlug(slug);
  if (!study) notFound();

  const { prev, next } = await getAdjacentCaseStudies(slug);
  const fm = study.frontmatter;

  return (
    <article className="pb-20">
      <div className="container-shell pt-10 md:pt-14">
        <Link
          href="/case-studies"
          className="text-eyebrow text-foreground-subtle hover:text-accent transition-colors"
        >
          {t("back")}
        </Link>
      </div>

      <header className="container-shell pt-10 md:pt-14">
        <div className="max-w-4xl space-y-5">
          <div className="flex items-center gap-3">
            {fm.sample && (
              <span className="text-xs font-mono uppercase tracking-wider text-warning">
                {t("sampleBadge")}
              </span>
            )}
            <Eyebrow>
              {fm.industry.toUpperCase()} · {fm.region.toUpperCase()}
            </Eyebrow>
          </div>
          <h1 className="text-h1">{fm.title}</h1>
          <p className="max-w-prose text-lg text-foreground-muted leading-relaxed">
            {fm.outcome}
          </p>
        </div>
        <div className="max-w-4xl">
          <MetricStrip metrics={fm.metrics} />
        </div>
      </header>

      <div className="container-shell mt-16 grid gap-12 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-8">
          <MDXRemote source={study.content} components={mdxComponents} />
        </div>
        <div className="lg:col-span-4">
          <MetadataRail
            fm={fm}
            labels={{
              rolloutWeeks: t("rolloutWeeks"),
              shadowWeeks: t("shadowWeeks"),
              team: t("team"),
              languages: t("languages"),
              events: t("events"),
              storage: t("storage"),
              ml: t("ml"),
              infra: t("infra"),
            }}
          />
        </div>
      </div>

      <div className="container-shell mt-20 grid gap-4 border-t border-border pt-10 sm:grid-cols-2">
        {prev ? (
          <Link
            href={`/case-studies/${prev.frontmatter.slug}`}
            className="group rounded-lg border border-border bg-background-elev/40 p-5 transition-all hover:border-border-strong"
          >
            <div className="text-eyebrow text-foreground-subtle">
              {t("previousCase")}
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
            href={`/case-studies/${next.frontmatter.slug}`}
            className="group rounded-lg border border-border bg-background-elev/40 p-5 text-right transition-all hover:border-border-strong sm:col-start-2"
          >
            <div className="text-eyebrow text-foreground-subtle">
              {t("nextCase")}
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
              <h2 className="text-h2">{t("ctaTitle")}</h2>
              <p className="max-w-prose text-foreground-muted">{t("ctaBody")}</p>
            </div>
            <Link
              href="/contact"
              className="inline-flex h-10 items-center justify-center self-start rounded-md bg-accent px-6 text-sm font-medium text-accent-foreground transition-all hover:bg-accent/90 md:self-center"
            >
              {t("ctaButton")}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
