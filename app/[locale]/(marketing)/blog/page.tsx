import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section, Eyebrow } from "@/components/marketing/section";
import { getAllBlogPosts } from "@/lib/blog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Blog" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

function formatDate(iso: string): string {
  // Render YYYY-MM-DD deterministically from the frontmatter string.
  // Frontmatter dates are authored as YYYY-MM-DD already; normalize defensively.
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Blog" });
  const posts = await getAllBlogPosts();

  return (
    <Section>
      <div className="max-w-3xl">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h1 className="text-h1 mt-4">{t("headline")}</h1>
        <p className="mt-6 max-w-prose text-foreground-muted leading-relaxed">
          {t("lede")}
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="mt-14 text-foreground-muted">{t("empty")}</p>
      ) : (
        <ul className="mt-14 divide-y divide-border border-y border-border">
          {posts.map((post) => {
            const fm = post.frontmatter;
            const date = formatDate(fm.publishedAt);
            return (
              <li key={fm.slug}>
                <Link
                  href={`/blog/${fm.slug}`}
                  className="group block py-8 transition-colors"
                >
                  <div className="grid gap-4 lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-3">
                      <time
                        dateTime={fm.publishedAt}
                        className="font-mono text-sm text-foreground-subtle"
                      >
                        {date}
                      </time>
                    </div>
                    <div className="lg:col-span-9">
                      <h2 className="text-h3 leading-tight text-foreground transition-colors group-hover:text-accent">
                        <span className="underline-sweep">{fm.title}</span>
                      </h2>
                      <p className="mt-3 max-w-prose text-foreground-muted leading-relaxed">
                        {fm.excerpt}
                      </p>
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        {fm.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center rounded border border-border bg-background px-2 py-0.5 font-mono text-xs text-foreground-muted"
                          >
                            {tag}
                          </span>
                        ))}
                        <span className="font-mono text-xs text-foreground-subtle">
                          {fm.minRead} {t("minRead")}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </Section>
  );
}
