import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Section, Eyebrow, GridBg } from "@/components/marketing/section";
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
          <div className="lg:sticky lg:top-24 space-y-3">
            <Eyebrow>RULE → COMPILED ARTIFACT</Eyebrow>
            <pre className="overflow-x-auto rounded-md border border-code-border bg-code-bg p-4 text-xs font-mono leading-relaxed">
{`// rules/credit-pre-approval.ts
import { rule, gte, lt, all } from "@hiram/rules";

export const preApprove = rule("credit.pre_approve", {
  version: "2025.04.03",
  inputs: { score: "number", debtRatio: "number", flagged: "boolean" },
  decide: all(
    gte("score", 680),
    lt("debtRatio", 0.42),
    (i) => !i.flagged,
  ),
  on_true:  { action: "PRE_APPROVE", limit_bps: 1500 },
  on_false: { action: "ROUTE_MANUAL_REVIEW" },
});

// $ hiram compile rules/credit-pre-approval.ts
// → out/credit.pre_approve.v2025_04_03.dg.bin (4 nodes, p99 0.31ms)
// → registry: pinned in shadow, 0.0% promoted`}
            </pre>
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
          <div className="lg:sticky lg:top-24 space-y-3">
            <Eyebrow>PROMPT IN → TYPED OUTPUT</Eyebrow>
            <pre className="overflow-x-auto rounded-md border border-code-border bg-code-bg p-4 text-xs font-mono leading-relaxed">
{`// queries/at-risk-accounts.ts
import { z } from "zod";
import { defineQuery } from "@hiram/query";

export const AtRiskAccounts = z.object({
  accounts: z.array(z.object({
    accountId: z.string(),
    riskScore: z.number().min(0).max(1),
    primaryReason: z.enum([
      "PAYMENT_FAILURE", "USAGE_DROP",
      "SUPPORT_ESCALATION", "CONTRACT_END",
    ]),
  })).max(50),
  unanswerable: z.boolean(),
});

export default defineQuery({
  id: "ops.at_risk_accounts",
  schema: AtRiskAccounts,
  evalSet: "evals/at-risk.golden.jsonl",
  minPassRate: 0.94,
});`}
            </pre>
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
          <div className="lg:sticky lg:top-24 space-y-3">
            <Eyebrow>TOPOLOGY (TYPICAL)</Eyebrow>
            <div className="rounded-md border border-code-border bg-code-bg p-4">
              <TopologyDiagram />
            </div>
            <p className="font-mono text-xs text-foreground-subtle leading-relaxed">
              SOURCES → TOPIC (PARTITIONED, SCHEMA-PINNED) → CONSUMER GROUPS.
              FAILURES SPILL TO DLQ. REPLAY TAP CAN REWIND ANY WINDOW INTO LIVE
              OR SHADOW.
            </p>
          </div>
        </aside>
      </div>
    </Section>
  );
}

function TopologyDiagram() {
  // semantic colors via design tokens
  const accent = "var(--accent)";
  const border = "var(--border-strong)";
  const muted = "var(--foreground-muted)";
  const subtle = "var(--foreground-subtle)";

  return (
    <svg
      viewBox="0 0 280 240"
      className="h-auto w-full"
      role="img"
      aria-label="Event sources flow into a partitioned topic, then into consumer groups, with a dead-letter queue and a replay tap."
    >
      <defs>
        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={muted} />
        </marker>
        <marker
          id="arrow-accent"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={accent} />
        </marker>
      </defs>

      {/* Sources */}
      <g>
        <rect x="6" y="18" width="64" height="22" rx="3" fill="none" stroke={border} />
        <text x="38" y="33" textAnchor="middle" fontSize="9" fill={muted} fontFamily="var(--font-mono)">
          source.api
        </text>
        <rect x="6" y="50" width="64" height="22" rx="3" fill="none" stroke={border} />
        <text x="38" y="65" textAnchor="middle" fontSize="9" fill={muted} fontFamily="var(--font-mono)">
          source.cdc
        </text>
        <rect x="6" y="82" width="64" height="22" rx="3" fill="none" stroke={border} />
        <text x="38" y="97" textAnchor="middle" fontSize="9" fill={muted} fontFamily="var(--font-mono)">
          source.iot
        </text>
      </g>

      {/* Arrows: sources → topic */}
      <line x1="70" y1="29" x2="108" y2="58" stroke={muted} strokeWidth="1" markerEnd="url(#arrow)" />
      <line x1="70" y1="61" x2="108" y2="61" stroke={muted} strokeWidth="1" markerEnd="url(#arrow)" />
      <line x1="70" y1="93" x2="108" y2="64" stroke={muted} strokeWidth="1" markerEnd="url(#arrow)" />

      {/* Topic */}
      <g>
        <rect x="108" y="42" width="80" height="40" rx="4" fill="none" stroke={accent} strokeWidth="1.5" />
        <text x="148" y="58" textAnchor="middle" fontSize="10" fill={accent} fontFamily="var(--font-mono)" fontWeight="600">
          events.v3
        </text>
        <text x="148" y="72" textAnchor="middle" fontSize="8" fill={subtle} fontFamily="var(--font-mono)">
          12 partitions
        </text>
      </g>

      {/* Arrows: topic → consumers */}
      <line x1="188" y1="52" x2="218" y2="32" stroke={muted} strokeWidth="1" markerEnd="url(#arrow)" />
      <line x1="188" y1="62" x2="218" y2="62" stroke={muted} strokeWidth="1" markerEnd="url(#arrow)" />
      <line x1="188" y1="72" x2="218" y2="92" stroke={muted} strokeWidth="1" markerEnd="url(#arrow)" />

      {/* Consumers */}
      <g>
        <rect x="218" y="20" width="56" height="22" rx="3" fill="none" stroke={border} />
        <text x="246" y="35" textAnchor="middle" fontSize="9" fill={muted} fontFamily="var(--font-mono)">
          cg.decide
        </text>
        <rect x="218" y="50" width="56" height="22" rx="3" fill="none" stroke={border} />
        <text x="246" y="65" textAnchor="middle" fontSize="9" fill={muted} fontFamily="var(--font-mono)">
          cg.audit
        </text>
        <rect x="218" y="80" width="56" height="22" rx="3" fill="none" stroke={border} />
        <text x="246" y="95" textAnchor="middle" fontSize="9" fill={muted} fontFamily="var(--font-mono)">
          cg.olap
        </text>
      </g>

      {/* DLQ */}
      <line
        x1="246"
        y1="102"
        x2="246"
        y2="138"
        stroke={muted}
        strokeWidth="1"
        strokeDasharray="3 2"
        markerEnd="url(#arrow)"
      />
      <text x="252" y="124" fontSize="8" fill={subtle} fontFamily="var(--font-mono)">
        on fail
      </text>
      <rect x="208" y="140" width="76" height="24" rx="3" fill="none" stroke={border} />
      <text x="246" y="156" textAnchor="middle" fontSize="9" fill={muted} fontFamily="var(--font-mono)">
        dlq.events.v3
      </text>

      {/* Replay tap */}
      <g>
        <rect x="40" y="180" width="100" height="28" rx="3" fill="none" stroke={accent} strokeDasharray="4 3" />
        <text x="90" y="198" textAnchor="middle" fontSize="9" fill={accent} fontFamily="var(--font-mono)">
          replay tap
        </text>
      </g>

      {/* Replay arrows */}
      <path
        d="M 140 194 Q 180 194 180 130 Q 180 82 188 70"
        fill="none"
        stroke={accent}
        strokeWidth="1"
        strokeDasharray="3 3"
        markerEnd="url(#arrow-accent)"
      />
      <path
        d="M 90 180 Q 90 130 108 70"
        fill="none"
        stroke={accent}
        strokeWidth="1"
        strokeDasharray="3 3"
        markerEnd="url(#arrow-accent)"
      />

      {/* Caption */}
      <text x="140" y="228" textAnchor="middle" fontSize="8" fill={subtle} fontFamily="var(--font-mono)">
        sources → topic → consumer groups · dlq + replay
      </text>
    </svg>
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
