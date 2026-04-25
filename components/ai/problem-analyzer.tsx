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
import { ANALYZER_SYSTEM } from "@/lib/ai/prompts";
import { StreamedSection, type StreamedSectionState } from "./streamed-section";
import { PromptSheet } from "./prompt-sheet";
import { initialTrace, type TraceState } from "./request-trace-panel";

export function ProblemAnalyzer({
  variant = "homepage",
  enableInspect = false,
  seed,
  onProblemChange,
  onTraceChange,
}: {
  variant?: "homepage" | "full";
  enableInspect?: boolean;
  seed?: string;
  onProblemChange?: (s: string) => void;
  onTraceChange?: (t: TraceState) => void;
}) {
  const t = useTranslations("ProblemAnalyzer");
  const tDemo = useTranslations("Demo");
  const seedChips = t.raw("seedChips") as string[];
  const [problem, setProblemState] = React.useState("");
  const [rateBanner, setRateBanner] = React.useState<string | null>(null);

  const onProblemChangeRef = React.useRef(onProblemChange);
  const onTraceChangeRef = React.useRef(onTraceChange);
  React.useEffect(() => {
    onProblemChangeRef.current = onProblemChange;
  }, [onProblemChange]);
  React.useEffect(() => {
    onTraceChangeRef.current = onTraceChange;
  }, [onTraceChange]);

  const setProblem = React.useCallback((next: string) => {
    setProblemState(next);
    onProblemChangeRef.current?.(next);
  }, []);

  // Trace lifecycle state.
  const submitStartRef = React.useRef<number | null>(null);
  const cachedThisSessionRef = React.useRef<boolean>(false);
  const traceRef = React.useRef<TraceState>(initialTrace);
  const tickRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const emitTrace = React.useCallback((next: TraceState) => {
    traceRef.current = next;
    onTraceChangeRef.current?.(next);
  }, []);

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

  const onSubmit = React.useCallback(
    (text: string) => {
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

      // Initialize trace for this submission.
      const promptTokens = Math.ceil((ANALYZER_SYSTEM.length + trimmed.length) / 4);
      const cachedTokens = cachedThisSessionRef.current
        ? Math.ceil(ANALYZER_SYSTEM.length / 4)
        : 0;
      submitStartRef.current = Date.now();
      emitTrace({
        status: "streaming",
        promptTokens,
        cachedTokens,
        outputTokens: 0,
        latencyMs: 0,
      });

      submit({ problem: trimmed });
    },
    [emitTrace, submit, t],
  );

  // Drive a 100ms tick to update latency + outputTokens while streaming.
  React.useEffect(() => {
    if (isLoading) {
      if (tickRef.current) clearInterval(tickRef.current);
      tickRef.current = setInterval(() => {
        const start = submitStartRef.current;
        if (start == null) return;
        const elapsed = Date.now() - start;
        const out = object ? Math.ceil(JSON.stringify(object).length / 4) : 0;
        emitTrace({
          ...traceRef.current,
          status: "streaming",
          latencyMs: elapsed,
          outputTokens: out,
        });
      }, 100);
      return () => {
        if (tickRef.current) {
          clearInterval(tickRef.current);
          tickRef.current = null;
        }
      };
    }
    // not loading: clear any tick and finalize.
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
    if (error) {
      const start = submitStartRef.current ?? Date.now();
      emitTrace({
        ...traceRef.current,
        status: "error",
        latencyMs: Date.now() - start,
      });
      return;
    }
    if (submitStartRef.current != null && object) {
      const elapsed = Date.now() - submitStartRef.current;
      const out = Math.ceil(JSON.stringify(object).length / 4);
      emitTrace({
        ...traceRef.current,
        status: "done",
        latencyMs: elapsed,
        outputTokens: out,
      });
      cachedThisSessionRef.current = true;
      submitStartRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, error, object, emitTrace]);

  // Auto-submit when seed prop changes (used by RecentQueriesRail picks).
  const lastSeedRef = React.useRef<string | undefined>(undefined);
  React.useEffect(() => {
    if (seed == null) return;
    if (seed === lastSeedRef.current) return;
    lastSeedRef.current = seed;
    if (!seed.trim()) return;
    setProblem(seed);
    onSubmit(seed);
  }, [seed, onSubmit, setProblem]);

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
          {enableInspect && (
            <div className="ml-auto">
              <PromptSheet
                problem={problem}
                trigger={
                  <button
                    type="button"
                    className="font-mono text-[11px] uppercase tracking-wider text-foreground-subtle transition-colors hover:text-accent"
                  >
                    {tDemo("inspectPrompt")}
                  </button>
                }
              />
            </div>
          )}
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
