import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Section, Eyebrow, GridBg } from "@/components/marketing/section";
import { MiniRuleEvaluator } from "@/components/capabilities/mini-rule-evaluator";
import { MiniQueryDemo } from "@/components/capabilities/mini-query-demo";
import { MiniTopology } from "@/components/capabilities/mini-topology";
import { cn } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Capabilities" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function CapabilitiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Hero />
      <DecisionEngines />
      <AiQueryLayer />
      <EventInfrastructure />
      <FinalCTA />
    </>
  );
}

function Hero() {
  const t = useTranslations("Capabilities");
  const tocItems = t.raw("toc") as { num: string; label: string }[];
  const tocHrefs: Record<string, string> = {
    "01": "#decision-engines",
    "02": "#ai-query-layer",
    "03": "#event-infrastructure",
  };

  return (
    <section className="relative overflow-hidden">
      <GridBg />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-accent/10 blur-3xl"
      />
      <div className="container-shell relative grid items-end gap-12 py-20 md:py-28 lg:grid-cols-12 lg:gap-8 lg:py-32">
        <div className="space-y-7 lg:col-span-8">
          <Eyebrow accent>{t("hero.eyebrow")}</Eyebrow>
          <h1 className="text-display max-w-[16ch]">{t("hero.headline")}</h1>
          <p className="max-w-prose text-lg text-foreground-muted leading-relaxed">
            {t("hero.lede")}
          </p>
        </div>
        <div className="lg:col-span-4">
          <ul className="divide-y divide-border border-y border-border">
            {tocItems.map((row) => (
              <li key={row.num}>
                <Link
                  href={tocHrefs[row.num] ?? "#"}
                  className="group flex items-center justify-between gap-4 py-4 transition-colors hover:text-accent"
                >
                  <span className="flex items-baseline gap-4">
                    <span className="font-mono text-xs text-foreground-subtle">
                      {row.num}
                    </span>
                    <span className="text-h3">{row.label}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-foreground-subtle transition-transform group-hover:translate-x-1 group-hover:text-accent" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function CapabilityHeader({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="max-w-3xl">
      <Eyebrow accent>{eyebrow}</Eyebrow>
      <h2 className="text-h1 mt-4">{title}</h2>
    </div>
  );
}

function HowItWorks({ items }: { items: { title: string; body: string }[] }) {
  const t = useTranslations("Capabilities");
  return (
    <div className="space-y-4">
      <Eyebrow>{t("howItWorks")}</Eyebrow>
      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={item.title}
            className="flex gap-4 border-l-2 border-accent/30 pl-4"
          >
            <div>
              <div className="font-medium">{item.title}</div>
              <div className="mt-1 text-sm text-foreground-muted leading-relaxed">
                {item.body}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

type CellMark = "yes" | "partial" | "no";

function Mark({ value }: { value: CellMark }) {
  if (value === "yes") {
    return (
      <span className="font-mono text-success" aria-label="Yes">
        ✓
      </span>
    );
  }
  if (value === "partial") {
    return (
      <span className="font-mono text-warning" aria-label="Partial">
        ~
      </span>
    );
  }
  return (
    <span className="font-mono text-danger" aria-label="No">
      ✗
    </span>
  );
}

function DecisionEngines() {
  const t = useTranslations("Capabilities");
  const items = t.raw("decisionEngines.items") as {
    title: string;
    body: string;
  }[];
  const comparisonHeaders = t.raw(
    "decisionEngines.comparisonHeaders",
  ) as string[];
  const comparisonRowLabels = t.raw(
    "decisionEngines.comparisonRows",
  ) as string[];

  // Cell data is not translated — it represents the pattern shown in the table.
  // Order matches the order of comparisonRowLabels.
  const cellData: { cells: CellMark[]; highlight?: boolean }[] = [
    { cells: ["yes", "partial", "no", "partial"] },
    { cells: ["partial", "no", "partial", "no"] },
    { cells: ["yes", "partial", "no", "partial"] },
    { cells: ["yes", "yes", "yes", "yes"], highlight: true },
  ];

  const compareRows = comparisonRowLabels.map((label, i) => ({
    label,
    cells: cellData[i].cells,
    highlight: cellData[i].highlight,
  }));

  return (
    <Section id="decision-engines">
      <CapabilityHeader
        eyebrow={t("decisionEngines.eyebrow")}
        title={t("decisionEngines.headline")}
      />
      <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="space-y-12 lg:col-span-7">
          <p className="max-w-prose text-lg text-foreground-muted leading-relaxed">
            {t("decisionEngines.lede")}
          </p>

          <HowItWorks items={items} />

          <div className="space-y-4">
            <Eyebrow>{t("whenYouNeedThis")}</Eyebrow>
            <p className="max-w-prose text-sm text-foreground-muted leading-relaxed">
              {t("decisionEngines.comparisonIntro")}
            </p>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-background-elev/60">
                  <tr className="border-b border-border">
                    {comparisonHeaders.map((header, i) => (
                      <th
                        key={i}
                        className={cn(
                          "py-3 font-mono text-xs font-medium uppercase tracking-wider text-foreground-subtle",
                          i === 0 ? "px-4" : "px-3",
                        )}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {compareRows.map((row) => (
                    <tr
                      key={row.label}
                      className={cn(
                        "border-b border-border last:border-b-0",
                        row.highlight && "bg-accent/5",
                      )}
                    >
                      <td
                        className={cn(
                          "px-4 py-3 text-foreground-muted",
                          row.highlight && "font-medium text-foreground",
                        )}
                      >
                        {row.label}
                      </td>
                      {row.cells.map((cell, i) => (
                        <td key={i} className="px-3 py-3">
                          <Mark value={cell} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="font-mono text-xs text-foreground-subtle">
              ✓ NATIVE · ~ POSSIBLE WITH WORK · ✗ NOT THE TOOL FOR THE JOB
            </p>
          </div>
        </div>

        <aside className="lg:col-span-5">
          <div className="lg:sticky lg:top-24">
            <MiniRuleEvaluator />
          </div>
        </aside>
      </div>
    </Section>
  );
}

function AiQueryLayer() {
  const t = useTranslations("Capabilities");
  const items = t.raw("aiQueryLayer.items") as {
    title: string;
    body: string;
  }[];
  const limits = t.raw("aiQueryLayer.limits") as string[];

  return (
    <Section id="ai-query-layer" bleed>
      <CapabilityHeader
        eyebrow={t("aiQueryLayer.eyebrow")}
        title={t("aiQueryLayer.headline")}
      />
      <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="space-y-12 lg:col-span-7">
          <p className="max-w-prose text-lg text-foreground-muted leading-relaxed">
            {t("aiQueryLayer.lede")}
          </p>

          <HowItWorks items={items} />

          <div className="space-y-4">
            <Eyebrow>{t("aiQueryLayer.limitsTitle")}</Eyebrow>
            <ul className="space-y-3">
              {limits.map((limit) => (
                <li
                  key={limit}
                  className="border-l-2 border-warning/50 pl-4"
                >
                  <div className="text-sm text-foreground-muted leading-relaxed">
                    {limit}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="lg:col-span-5">
          <div className="lg:sticky lg:top-24">
            <MiniQueryDemo />
          </div>
        </aside>
      </div>
    </Section>
  );
}

function EventInfrastructure() {
  const t = useTranslations("Capabilities");
  const tooling = t.raw("eventInfrastructure.tooling") as {
    title: string;
    body: string;
  }[];
  const always = t.raw("eventInfrastructure.always") as {
    title: string;
    body: string;
  }[];

  return (
    <Section id="event-infrastructure">
      <CapabilityHeader
        eyebrow={t("eventInfrastructure.eyebrow")}
        title={t("eventInfrastructure.headline")}
      />
      <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="space-y-12 lg:col-span-7">
          <p className="max-w-prose text-lg text-foreground-muted leading-relaxed">
            {t("eventInfrastructure.lede")}
          </p>

          <div className="space-y-4">
            <Eyebrow>{t("eventInfrastructure.toolingTitle")}</Eyebrow>
            <ul className="space-y-4">
              {tooling.map((item) => (
                <li
                  key={item.title}
                  className="flex gap-4 border-l-2 border-accent/30 pl-4"
                >
                  <div>
                    <div className="font-mono text-sm font-medium text-accent">
                      {item.title}
                    </div>
                    <div className="mt-1 text-sm text-foreground-muted leading-relaxed">
                      {item.body}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <Eyebrow>{t("eventInfrastructure.alwaysTitle")}</Eyebrow>
            <ul className="space-y-4">
              {always.map((item) => (
                <li
                  key={item.title}
                  className="flex gap-4 border-l-2 border-accent/30 pl-4"
                >
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className="mt-1 text-sm text-foreground-muted leading-relaxed">
                      {item.body}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="lg:col-span-5">
          <div className="lg:sticky lg:top-24">
            <MiniTopology />
          </div>
        </aside>
      </div>
    </Section>
  );
}

function FinalCTA() {
  const t = useTranslations("Home.finalCta");
  const tCommon = useTranslations("Common");
  return (
    <Section bleed>
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
