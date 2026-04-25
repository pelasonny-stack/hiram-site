"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { Activity, AlertCircle, Code2, GitBranch, Target } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { analysisSchema } from "@/lib/ai/schemas";
import { StreamedSection, type StreamedSectionState } from "./streamed-section";

export function ProblemAnalyzer({
  variant = "homepage",
}: {
  variant?: "homepage" | "full";
}) {
  const t = useTranslations("ProblemAnalyzer");
  const seedChips = t.raw("seedChips") as string[];
  const [problem, setProblem] = React.useState("");
  const [rateBanner, setRateBanner] = React.useState<string | null>(null);

  const { object, submit, isLoading, error, stop } = useObject({
    api: "/api/analyze",
    schema: analysisSchema,
    onError: async (err: Error) => {
      try {
        const msg = JSON.parse(err.message) as { error?: string };
        if (msg.error) {
          setRateBanner(msg.error);
          return;
        }
      } catch {
        /* fallthrough */
      }
      toast.error(t("genericError"));
    },
  });

  const onSubmit = (text: string) => {
    const trimmed = text.trim();
    if (trimmed.length < 20) {
      toast.error(t("tooShort"));
      return;
    }
    if (trimmed.length > 1500) {
      toast.error(t("tooLong"));
      return;
    }
    setRateBanner(null);
    submit({ problem: trimmed });
  };

  const state = (key: keyof typeof analysisSchema.shape): StreamedSectionState => {
    if (error) return "error";
    if (object?.[key]) return isLoading ? "streaming" : "done";
    if (isLoading) return "streaming";
    return "idle";
  };

  const isPresent = (key: keyof typeof analysisSchema.shape) => Boolean(object?.[key]);

  return (
    <div className={cn("space-y-6", variant === "full" && "space-y-8")}>
      <div className="space-y-3">
        <Textarea
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder={t("textareaPlaceholder")}
          rows={variant === "full" ? 5 : 4}
          maxLength={1500}
          disabled={isLoading}
          className="resize-none border-border bg-background-elev/60 font-mono text-sm leading-relaxed placeholder:text-foreground-subtle"
        />
        <div className="flex flex-wrap items-center gap-2">
          {seedChips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => {
                setProblem(chip);
                onSubmit(chip);
              }}
              disabled={isLoading}
              className="rounded-full border border-border bg-background-elev/40 px-3 py-1 text-xs text-foreground-muted transition-colors hover:border-accent-muted hover:text-foreground disabled:opacity-50"
            >
              {chip}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs font-mono text-foreground-subtle">
            {problem.length}/1500
          </div>
          <div className="flex gap-2">
            {isLoading && (
              <Button variant="ghost" size="sm" onClick={() => stop()}>
                {t("stop")}
              </Button>
            )}
            <Button
              size="sm"
              onClick={() => onSubmit(problem)}
              disabled={isLoading || problem.trim().length < 20}
            >
              {isLoading ? t("submitting") : t("submit")}
            </Button>
          </div>
        </div>
      </div>

      {rateBanner && (
        <div className="flex items-center gap-3 rounded-md border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-foreground">
          <AlertCircle className="h-4 w-4 shrink-0 text-warning" />
          <div className="flex-1">{rateBanner}</div>
          <Link
            href="/contact"
            className="text-xs font-mono text-accent hover:underline"
          >
            {t("contactCta")}
          </Link>
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        <StreamedSection
          title={t("section1")}
          icon={Activity}
          state={state("diagnosis")}
          isPresent={isPresent("diagnosis")}
        >
          {object?.diagnosis && (
            <>
              <p className="text-foreground">{object.diagnosis.symptom}</p>
              {object.diagnosis.rootCauseHypotheses && (
                <ul className="space-y-1.5">
                  {object.diagnosis.rootCauseHypotheses.map((h, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              )}
              {object.diagnosis.confidence && (
                <div className="text-xs font-mono uppercase tracking-wider text-foreground-subtle">
                  {t("confidence")}: {object.diagnosis.confidence}
                </div>
              )}
            </>
          )}
        </StreamedSection>

        <StreamedSection
          title={t("section2")}
          icon={GitBranch}
          state={state("suggestedSystem")}
          isPresent={isPresent("suggestedSystem")}
        >
          {object?.suggestedSystem && (
            <>
              {object.suggestedSystem.eventsCaptured && (
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-foreground-subtle mb-1">
                    {t("eventsCaptured")}
                  </div>
                  <ul className="space-y-1">
                    {object.suggestedSystem.eventsCaptured.map((e, i) => (
                      <li key={i} className="font-mono text-xs text-foreground">
                        {e}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {object.suggestedSystem.decisionEngine && (
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-foreground-subtle mb-1">
                    {t("decisionEngine")}
                  </div>
                  <p>{object.suggestedSystem.decisionEngine}</p>
                </div>
              )}
              {object.suggestedSystem.actionsTriggered && (
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-foreground-subtle mb-1">
                    {t("actionsTriggered")}
                  </div>
                  <ul className="space-y-1">
                    {object.suggestedSystem.actionsTriggered.map((a, i) => (
                      <li key={i} className="font-mono text-xs text-foreground">
                        → {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </StreamedSection>

        <StreamedSection
          title={t("section3")}
          icon={Code2}
          state={state("exampleDecision")}
          isPresent={isPresent("exampleDecision")}
          className="md:col-span-2"
        >
          {object?.exampleDecision && (
            <>
              {object.exampleDecision.rule && (
                <p className="text-foreground">{object.exampleDecision.rule}</p>
              )}
              {object.exampleDecision.examplePayload && (
                <pre className="mt-2 max-h-72 overflow-auto rounded-md border border-code-border bg-code-bg p-3 font-mono text-xs leading-relaxed text-foreground">
                  {JSON.stringify(object.exampleDecision.examplePayload, null, 2)}
                </pre>
              )}
            </>
          )}
        </StreamedSection>

        <StreamedSection
          title={t("section4")}
          icon={Target}
          state={state("estimatedImpact")}
          isPresent={isPresent("estimatedImpact")}
          className="md:col-span-2"
        >
          {object?.estimatedImpact && (
            <div className="grid gap-4 md:grid-cols-3">
              <ImpactCell label={t("effort")} value={object.estimatedImpact.effort} />
              <ImpactCell label={t("impact")} value={object.estimatedImpact.impactBracket} />
              <div className="md:col-span-3 text-foreground-muted">
                {object.estimatedImpact.rationale}
              </div>
            </div>
          )}
        </StreamedSection>
      </div>

      {variant === "homepage" && (
        <div className="text-xs font-mono text-foreground-subtle">
          {t("footer")} ·{" "}
          <Link href="/demo" className="text-accent hover:underline">
            {t("openFullDemo")}
          </Link>
        </div>
      )}
    </div>
  );
}

function ImpactCell({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-md border border-border bg-background-elev/40 px-4 py-3">
      <div className="text-xs font-mono uppercase tracking-wider text-foreground-subtle">
        {label}
      </div>
      <div className="mt-1 font-mono text-base text-accent uppercase">
        {value ?? "—"}
      </div>
    </div>
  );
}
