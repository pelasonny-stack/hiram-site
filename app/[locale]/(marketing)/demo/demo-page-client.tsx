"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Section, Eyebrow } from "@/components/marketing/section";
import { ProblemAnalyzer } from "@/components/ai/problem-analyzer";
import { RecentQueriesRail } from "@/components/ai/recent-queries-rail";
import {
  RequestTracePanel,
  initialTrace,
  type TraceState,
} from "@/components/ai/request-trace-panel";

export function DemoPageClient() {
  const t = useTranslations("Demo");
  const [seed, setSeed] = React.useState<string | undefined>(undefined);
  const [, setProblem] = React.useState("");
  const [trace, setTrace] = React.useState<TraceState>(initialTrace);

  const onPick = React.useCallback((prompt: string) => {
    setSeed(prompt);
  }, []);

  return (
    <Section>
      <header className="max-w-3xl space-y-5">
        <Eyebrow accent>{t("eyebrow")}</Eyebrow>
        <h1 className="text-h1">{t("headline")}</h1>
        <p className="text-lg text-foreground-muted">{t("lede")}</p>
      </header>

      <div className="mt-12 grid gap-6 lg:grid-cols-12">
        <div className="order-3 lg:order-1 lg:col-span-3">
          <RecentQueriesRail onPick={onPick} />
        </div>
        <div className="order-1 lg:order-2 lg:col-span-6">
          <ProblemAnalyzer
            variant="full"
            enableInspect
            seed={seed}
            onProblemChange={setProblem}
            onTraceChange={setTrace}
          />
        </div>
        <div className="order-2 lg:order-3 lg:col-span-3">
          <RequestTracePanel trace={trace} />
        </div>
      </div>
    </Section>
  );
}
