import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section, Eyebrow } from "@/components/marketing/section";
import {
  CaseSchematic,
  schematicForSlug,
} from "@/components/marketing/case-schematic";
import { getAllCaseStudies } from "@/lib/case-studies";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "CaseStudies" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function CaseStudiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "CaseStudies" });
  const studies = await getAllCaseStudies();
  const readCaseText = t("readCase").replace(/\s*→\s*$/, "").trim();

  return (
    <Section>
      <div className="max-w-3xl">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h1 className="text-h1 mt-4">{t("headline")}</h1>
        <p className="mt-6 max-w-prose text-foreground-muted leading-relaxed">
          {t("lede")}
        </p>
      </div>

      <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {studies.map((s) => {
          const fm = s.frontmatter;
          const stamp = `${fm.industry.toUpperCase()} // ${fm.region.toUpperCase()}`;
          const variant = schematicForSlug(fm.slug);
          const readouts = fm.metrics
            .slice(0, 3)
            .map((m) => `${m.value} ${m.label}`.trim().toUpperCase());
          return (
            <Link
              key={fm.slug}
              href={`/case-studies/${fm.slug}`}
              className="group corner-accent flex flex-col border border-border p-6 transition-colors hover:border-border-strong"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="font-mono text-eyebrow text-foreground-subtle">
                  {stamp}
                </span>
                <div className="flex flex-col items-end gap-2">
                  {fm.sample && (
                    <span className="font-mono text-[10px] uppercase tracking-wider text-warning">
                      {t("sampleBadge")}
                    </span>
                  )}
                  <CaseSchematic
                    variant={variant}
                    className="text-accent shrink-0"
                  />
                </div>
              </div>
              <h3 className="mt-4 text-h3 leading-tight">{fm.title}</h3>
              <p className="mt-2 text-sm text-foreground-muted leading-relaxed">
                {fm.outcome}
              </p>
              <div className="hairline-rule mt-5" />
              <div className="mt-4 grid grid-cols-3 gap-4">
                {readouts.map((readout, j) => (
                  <div
                    key={j}
                    className="font-mono text-base md:text-lg text-accent leading-tight"
                  >
                    {readout}
                  </div>
                ))}
              </div>
              <span className="mt-6 inline-flex items-baseline gap-2 self-start text-sm">
                <span className="font-mono text-accent">→</span>
                <span className="underline-sweep text-foreground">
                  {readCaseText}
                </span>
              </span>
            </Link>
          );
        })}
      </div>

      {studies.length === 0 && (
        <p className="mt-12 text-foreground-muted">{t("empty")}</p>
      )}
    </Section>
  );
}
