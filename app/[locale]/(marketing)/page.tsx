import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Section, Eyebrow, Stat } from "@/components/marketing/section";
import {
  TelemetryStrip,
  type TelemetryItem,
} from "@/components/marketing/telemetry-strip";
import { LiveSimulation } from "@/components/simulation/live-simulation";
import { ProblemAnalyzer } from "@/components/ai/problem-analyzer";
import {
  CaseSchematic,
  type SchematicVariant,
} from "@/components/marketing/case-schematic";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhatWeDo />
      <Proof />
      <Demo />
      <Capabilities />
      <CaseStudiesPreview />
      <FinalCTA />
    </>
  );
}

function Hero() {
  const t = useTranslations("Home.hero");
  const telemetry = t.raw("telemetry") as TelemetryItem[];
  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 grid-bg-dense"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-48 -top-48 h-[640px] w-[640px] rounded-full bg-accent/10 blur-3xl"
        />
        <div className="container-shell relative pt-4 pb-12 md:pb-16 lg:pb-20">
          {/* 1 — top telemetry strip */}
          <TelemetryStrip items={telemetry} />

          {/* 2 — headline block (asymmetric) */}
          <div className="mt-10 grid gap-6 md:mt-14 lg:grid-cols-12 lg:gap-8">
            <div className="space-y-6 lg:col-span-9">
              <Eyebrow accent className="font-mono">
                {t("eyebrow")}
              </Eyebrow>
              <h1 className="text-display-massive max-w-[14ch]">
                {t("headline")}
              </h1>
              <p className="max-w-prose text-lg text-foreground-muted leading-relaxed">
                {t("subhead")}
              </p>

              {/* 3 — CTA row */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
                <Button asChild size="lg">
                  <Link href="#demo">
                    {t("ctaPrimary")}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Link
                  href="/case-studies"
                  className="font-mono text-sm uppercase tracking-wider text-foreground underline-sweep"
                >
                  <span className="text-accent">{"→ "}</span>
                  {t("ctaSecondary")}
                </Link>
              </div>
            </div>
            <div className="hidden lg:col-span-3 lg:flex lg:items-end lg:justify-end">
              <span className="font-mono text-xs uppercase tracking-wider text-foreground-subtle">
                {"// v0.1"}
              </span>
            </div>
          </div>

          {/* 4 — trust strip */}
          <div className="mt-12 md:mt-16">
            <div className="hairline-rule" />
            <p className="mt-4 text-eyebrow text-foreground-subtle">
              {t("trust")}
            </p>
          </div>
        </div>
      </section>

      <section className="relative border-y border-border bg-background-elev/30">
        <div className="container-shell py-8">
          <LiveSimulation variant="strip" />
        </div>
      </section>
    </>
  );
}

function WhatWeDo() {
  const t = useTranslations("Home.whatWeDo");
  const rows = t.raw("rows") as { title: string; body: string }[];

  return (
    <Section>
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h2 className="text-h1 mt-4 max-w-[18ch]">{t("headline")}</h2>
          <p className="mt-5 max-w-prose text-foreground-muted">{t("lede")}</p>
        </div>
        <ul className="space-y-0 lg:col-span-8">
          {rows.map((r, i) => (
            <li
              key={r.title}
              className={cn(
                "flex flex-col gap-3 border-l-2 border-transparent py-8 pl-6 transition-colors hover:border-accent",
                i > 0 && "border-t border-t-border",
              )}
            >
              <h3 className="text-h3">{r.title}</h3>
              <p className="text-foreground-muted leading-relaxed max-w-prose">
                {r.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

function Proof() {
  const t = useTranslations("Home.proof");
  const stats = t.raw("stats") as { value: string; label: string }[];

  return (
    <Section bleed>
      <div className="text-center">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h2 className="text-h2 mt-4">{t("headline")}</h2>
      </div>
      <div className="mt-14 grid gap-12 md:grid-cols-3 md:gap-8">
        <Stat
          value={stats[0].value}
          label={stats[0].label}
          className="md:text-center md:items-center md:flex md:flex-col"
        />
        <Stat
          value={stats[1].value}
          label={stats[1].label}
          className="md:text-center md:items-center md:flex md:flex-col md:border-x md:border-border md:px-8"
        />
        <Stat
          value={stats[2].value}
          label={stats[2].label}
          className="md:text-center md:items-center md:flex md:flex-col"
        />
      </div>
      <p className="mt-10 text-center text-sm text-foreground-subtle">
        {t("footnote")}
      </p>
    </Section>
  );
}

function Demo() {
  const t = useTranslations("Home.demo");
  return (
    <Section id="demo">
      <div className="max-w-3xl space-y-4">
        <Eyebrow accent>{t("eyebrow")}</Eyebrow>
        <h2 className="text-h1">{t("headline")}</h2>
        <p className="max-w-prose text-lg text-foreground-muted">{t("lede")}</p>
      </div>
      <div className="mt-12">
        <ProblemAnalyzer variant="homepage" />
      </div>
    </Section>
  );
}

// Synthesized technical readouts — intentionally English (datasheet voice).
const CAPABILITY_SPEC_VALUES: Record<number, string[]> = {
  0: ["WASM · TS · Rust", "p99 < 80ms", "versioned, replayable"],
  1: ["Claude · GPT-class", "typed (Zod)", "golden set per query"],
  2: ["Kafka · Redpanda · NATS", "exactly-once where needed", "DLQ from day one"],
};

function Capabilities() {
  const t = useTranslations("Home.capabilities");
  const cards = t.raw("cards") as {
    title: string;
    body: string;
    bullets: string[];
  }[];
  const hrefs = [
    "/capabilities#decision-engines",
    "/capabilities#ai-query-layer",
    "/capabilities#event-infrastructure",
  ];
  const ctaText = t("cardCta").replace(/\s*→\s*$/, "").trim();

  return (
    <Section>
      <div className="max-w-2xl">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h2 className="text-h1 mt-4">{t("headline")}</h2>
      </div>
      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {cards.map((c, i) => {
          const idx = String(i + 1).padStart(2, "0");
          const values = CAPABILITY_SPEC_VALUES[i] ?? [];
          const rows = c.bullets.slice(0, 3).map((bullet, j) => ({
            key: bullet,
            value: values[j] ?? "—",
          }));
          return (
            <Link
              key={c.title}
              href={hrefs[i]}
              className="group corner-accent flex flex-col border border-border p-6 md:p-7 transition-colors hover:border-border-strong"
            >
              <div className="flex items-center justify-between font-mono text-xs uppercase tracking-wider text-foreground-subtle">
                <span>[{idx}]</span>
                <span>→ DOCS</span>
              </div>
              <h3 className="mt-5 text-h3 leading-tight">{c.title}</h3>
              <p className="mt-3 text-sm text-foreground-muted leading-relaxed">
                {c.body}
              </p>
              <div className="hairline-rule my-5" />
              <dl className="divide-y divide-border">
                {rows.map((row) => (
                  <div
                    key={row.key}
                    className="grid grid-cols-[1fr_auto] items-baseline gap-3 py-2"
                  >
                    <dt className="font-mono text-[10px] uppercase tracking-wider text-foreground-subtle">
                      {row.key}
                    </dt>
                    <dd className="font-mono text-xs text-foreground text-right">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
              <span className="mt-6 inline-flex items-baseline gap-2 self-start text-sm">
                <span className="font-mono text-accent">→</span>
                <span className="underline-sweep text-foreground">
                  {ctaText}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </Section>
  );
}

const PREVIEW_STAMPS = ["TELCO // LATAM", "FINTECH // EU", "RETAIL // NA"];
const PREVIEW_SCHEMATICS: SchematicVariant[] = ["shield", "scale", "bars"];

function CaseStudiesPreview() {
  const t = useTranslations("Home.caseStudiesPreview");
  const cases = t.raw("cards") as {
    slug: string;
    title: string;
    summary: string;
    metrics: string;
  }[];
  const readCaseText = t("readCase").replace(/\s*→\s*$/, "").trim();

  return (
    <Section bleed>
      <div className="flex items-end justify-between gap-6">
        <div>
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h2 className="text-h1 mt-4 max-w-2xl">{t("headline")}</h2>
          <p className="mt-4 max-w-prose text-foreground-muted">{t("lede")}</p>
        </div>
        <Link
          href="/case-studies"
          className="hidden text-eyebrow text-accent hover:underline md:inline-flex"
        >
          {t("all")}
        </Link>
      </div>
      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {cases.map((c, i) => {
          const stamp = PREVIEW_STAMPS[i] ?? "HIRAM // —";
          const variant = PREVIEW_SCHEMATICS[i] ?? "dots";
          const chunks = c.metrics.split(" · ").slice(0, 3);
          return (
            <Link
              key={c.slug}
              href={`/case-studies/${c.slug}`}
              className="group corner-accent flex flex-col border border-border p-6 transition-colors hover:border-border-strong"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="font-mono text-eyebrow text-foreground-subtle">
                  {stamp}
                </span>
                <CaseSchematic
                  variant={variant}
                  className="text-accent shrink-0"
                />
              </div>
              <h3 className="mt-4 text-h3 leading-tight">{c.title}</h3>
              <p className="mt-2 text-sm text-foreground-muted leading-relaxed">
                {c.summary}
              </p>
              <div className="hairline-rule mt-5" />
              <div className="mt-4 grid grid-cols-3 gap-4">
                {chunks.map((chunk, j) => (
                  <div
                    key={j}
                    className="font-mono text-base md:text-lg text-accent leading-tight"
                  >
                    {chunk}
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
      <Link
        href="/case-studies"
        className="mt-8 inline-flex text-eyebrow text-accent hover:underline md:hidden"
      >
        {t("all")}
      </Link>
    </Section>
  );
}

function FinalCTA() {
  const t = useTranslations("Home.finalCta");
  const tCommon = useTranslations("Common");
  return (
    <Section>
      <div className="mx-auto max-w-3xl text-center space-y-7">
        <h2 className="text-display">{t("headline")}</h2>
        <p className="text-lg text-foreground-muted max-w-prose mx-auto">
          {t("lede")}
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
          {tCommon("respondWithin")}
        </p>
      </div>
    </Section>
  );
}
