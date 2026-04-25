import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Section, Eyebrow } from "@/components/marketing/section";
import { cn } from "@/lib/utils";

type Tier = {
  id: string;
  marker: string;
  name: string;
  summary: string;
  price: string;
  duration: string;
  deliverables: string[];
  fitFor: string;
  cta: string;
  featured?: boolean;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pricing" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PricingContent />;
}

function PricingContent() {
  const t = useTranslations("Pricing");
  const tCommon = useTranslations("Common");

  const tiers = t.raw("tiers") as Tier[];
  const antiItems = t.raw("antiItems") as string[];

  return (
    <>
      <PricingHero />
      <TiersGrid tiers={tiers} />
      <AntiBlock
        headline={t("antiHeadline")}
        items={antiItems}
        footnote={t("footnote")}
      />
      <FinalCTA
        title={t("ctaTitle")}
        body={t("ctaBody")}
        respondWithin={tCommon("respondWithin")}
      />
    </>
  );
}

function PricingHero() {
  const t = useTranslations("Pricing");
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 grid-bg-dense"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-48 -top-48 h-[640px] w-[640px] rounded-full bg-accent/10 blur-3xl"
      />
      <div className="container-shell relative pt-16 pb-12 md:pt-24 md:pb-16 lg:pt-28 lg:pb-20">
        <div className="max-w-3xl">
          <Eyebrow accent className="font-mono">
            {t("eyebrow")}
          </Eyebrow>
          <h1 className="text-display mt-5 max-w-[18ch]">{t("headline")}</h1>
          <p className="mt-7 max-w-prose text-lg text-foreground-muted leading-relaxed">
            {t("lede")}
          </p>
        </div>
      </div>
    </section>
  );
}

function TiersGrid({ tiers }: { tiers: Tier[] }) {
  const t = useTranslations("Pricing");
  // Static labels — these are intentionally English datasheet voice across locales,
  // matching the homepage capability cards convention.
  const FIT_FOR = "FIT FOR";
  const RECOMMENDED = "RECOMMENDED";

  return (
    <Section>
      <div className="grid gap-5 lg:grid-cols-3 lg:gap-6">
        {tiers.map((tier) => {
          const featured = Boolean(tier.featured);
          return (
            <div
              key={tier.id}
              className={cn(
                "corner-accent relative flex flex-col border border-border p-6 md:p-7 transition-colors",
                featured
                  ? "bg-background-elev/60 border-border-strong"
                  : "bg-background-elev/30 hover:border-border-strong",
              )}
            >
              {featured && (
                <>
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-accent"
                  />
                  <span className="absolute right-4 top-3 text-eyebrow text-accent">
                    {RECOMMENDED}
                  </span>
                </>
              )}

              {/* Marker row */}
              <div className="flex items-center justify-between font-mono text-xs uppercase tracking-wider text-foreground-subtle">
                <span className="text-accent">[{tier.marker}]</span>
              </div>

              <div className="hairline-rule mt-4" />

              {/* Name + summary */}
              <h3 className="mt-5 text-h3 leading-tight">{tier.name}</h3>
              <p className="mt-2 font-mono text-xs text-foreground-muted leading-relaxed">
                {tier.summary}
              </p>

              {/* Price */}
              <div className="mt-6">
                <div className="font-mono text-3xl text-accent leading-none">
                  {tier.price}
                </div>
                <div className="mt-2 font-mono text-[11px] uppercase tracking-wider text-foreground-subtle">
                  {tier.duration}
                </div>
              </div>

              <div className="hairline-rule my-6" />

              {/* Deliverables */}
              <ul className="space-y-2.5">
                {tier.deliverables.map((d, i) => (
                  <li
                    key={i}
                    className="grid grid-cols-[auto_1fr] items-baseline gap-2"
                  >
                    <span className="font-mono text-accent text-sm">→</span>
                    <span className="text-sm text-foreground-muted leading-snug">
                      {d}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="hairline-rule my-6" />

              {/* Fit for */}
              <div className="space-y-2">
                <div className="text-eyebrow text-foreground-subtle">
                  {FIT_FOR}
                </div>
                <p className="text-sm text-foreground leading-snug">
                  {tier.fitFor}
                </p>
              </div>

              {/* CTA */}
              <div className="mt-8 flex-1 flex items-end">
                <Button
                  asChild
                  variant={featured ? "default" : "outline"}
                  size="lg"
                  className="w-full"
                >
                  <Link href="/contact">{tier.cta}</Link>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-8 text-center text-xs font-mono text-foreground-subtle">
        {t("footnote")}
      </p>
    </Section>
  );
}

function AntiBlock({
  headline,
  items,
  footnote,
}: {
  headline: string;
  items: string[];
  footnote: string;
}) {
  return (
    <Section bleed>
      <div className="mx-auto max-w-3xl">
        <h2 className="text-h2 text-center">{headline}</h2>
        <ul className="mt-12 border-y border-border">
          {items.map((item, i) => (
            <li
              key={i}
              className={cn(
                "grid grid-cols-[auto_1fr] items-baseline gap-4 py-5",
                i > 0 && "border-t border-border",
              )}
            >
              <span className="font-mono text-danger text-base leading-none">
                ✗
              </span>
              <span className="text-foreground leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center text-sm italic text-foreground-subtle">
          {footnote}
        </p>
      </div>
    </Section>
  );
}

function FinalCTA({
  title,
  body,
  respondWithin,
}: {
  title: string;
  body: string;
  respondWithin: string;
}) {
  const t = useTranslations("Home.finalCta");
  return (
    <Section>
      <div className="mx-auto max-w-3xl text-center space-y-7">
        <h2 className="text-h2">{title}</h2>
        <p className="text-lg text-foreground-muted max-w-prose mx-auto">
          {body}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button asChild size="lg">
            <Link href="/contact">{t("ctaPrimary")}</Link>
          </Button>
          <Button asChild variant="quiet" size="lg">
            <Link href="/demo">{t("ctaSecondary")}</Link>
          </Button>
        </div>
        <p className="text-xs font-mono text-foreground-subtle">
          {respondWithin}
        </p>
      </div>
    </Section>
  );
}
