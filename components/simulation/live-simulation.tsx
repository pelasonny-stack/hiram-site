"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { TelemetryStrip } from "@/components/marketing/telemetry-strip";

type EventKind = "payment" | "signup" | "churn_signal" | "fraud_probe";
type ActionKind = "charge" | "route_retention" | "route_fraud" | "notify";

interface InFlight {
  id: number;
  kind: EventKind;
  action: ActionKind;
  startedAt: number;
}

const SOURCES: { kind: EventKind; label: string; y: number }[] = [
  { kind: "payment", label: "payment", y: 50 },
  { kind: "signup", label: "signup", y: 130 },
  { kind: "churn_signal", label: "churn", y: 210 },
  { kind: "fraud_probe", label: "fraud", y: 290 },
];

const SINKS: { kind: ActionKind; label: string; y: number }[] = [
  { kind: "charge", label: "charge", y: 50 },
  { kind: "route_retention", label: "retention", y: 130 },
  { kind: "route_fraud", label: "fraud queue", y: 210 },
  { kind: "notify", label: "notify", y: 290 },
];

const KIND_COLOR: Record<EventKind, string> = {
  payment: "var(--accent)",
  signup: "var(--info)",
  churn_signal: "var(--warning)",
  fraud_probe: "var(--danger)",
};

function decide(kind: EventKind): ActionKind {
  switch (kind) {
    case "payment":
      return "charge";
    case "signup":
      return "notify";
    case "churn_signal":
      return "route_retention";
    case "fraud_probe":
      return Math.random() > 0.3 ? "route_fraud" : "notify";
  }
}

const SOURCE_X = 60;
const ENGINE_X = 240;
const SINK_X = 420;
const ENGINE_Y = 170;

type Variant = "card" | "strip";

function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  if (h > 0) return `${h}:${pad(m)}:${pad(s)}`;
  return `${pad(m)}:${pad(s)}`;
}

export function LiveSimulation({
  className,
  variant = "card",
}: {
  className?: string;
  variant?: Variant;
}) {
  const t = useTranslations("LiveSimulation");
  const reduce = useReducedMotion();
  const [inflight, setInflight] = React.useState<InFlight[]>([]);
  const [enginePulse, setEnginePulse] = React.useState(0);
  const [decisionsTotal, setDecisionsTotal] = React.useState(0);
  const [uptimeSec, setUptimeSec] = React.useState(0);
  const idRef = React.useRef(0);
  const visibleRef = React.useRef(true);

  React.useEffect(() => {
    const onVis = () => {
      visibleRef.current = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  React.useEffect(() => {
    if (variant !== "strip") return;
    const id = setInterval(() => setUptimeSec((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [variant]);

  React.useEffect(() => {
    if (reduce) return;
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      if (!visibleRef.current) {
        setTimeout(tick, 800);
        return;
      }
      setInflight((cur) => {
        if (cur.length >= 12) return cur;
        const kinds = SOURCES.map((s) => s.kind);
        const kind = kinds[Math.floor(Math.random() * kinds.length)]!;
        const id = ++idRef.current;
        setEnginePulse((p) => p + 1);
        setDecisionsTotal((d) => d + 1);
        return [
          ...cur,
          { id, kind, action: decide(kind), startedAt: Date.now() },
        ];
      });
      setTimeout(tick, 600 + Math.random() * 600);
    };
    const t = setTimeout(tick, 400);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [reduce]);

  const removeEvent = React.useCallback((id: number) => {
    setInflight((cur) => cur.filter((e) => e.id !== id));
  }, []);

  if (reduce) return <StaticDiagram className={className} variant={variant} />;

  const isStrip = variant === "strip";

  const svg = (
    <svg
      viewBox="0 0 480 340"
      className={cn(
        "w-full h-auto",
        isStrip && "min-h-[340px] md:min-h-[380px] lg:min-h-[420px]",
      )}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Live event-to-decision visualization. Events flow from sources through a decision engine to action sinks in real time."
    >
      <defs>
        {SOURCES.map((src, i) =>
          SINKS.map((sink, j) => (
            <path
              key={`p-${i}-${j}`}
              id={`path-${src.kind}-${sink.kind}`}
              d={`M ${SOURCE_X + 24} ${src.y} C ${SOURCE_X + 90} ${src.y}, ${ENGINE_X - 30} ${ENGINE_Y}, ${ENGINE_X + 30} ${ENGINE_Y} C ${SINK_X - 30} ${ENGINE_Y}, ${SINK_X - 90} ${sink.y}, ${SINK_X - 24} ${sink.y}`}
              fill="none"
            />
          )),
        )}
      </defs>

      {SOURCES.map((src) =>
        SINKS.map((sink) => (
          <path
            key={`bg-${src.kind}-${sink.kind}`}
            d={`M ${SOURCE_X + 24} ${src.y} C ${SOURCE_X + 90} ${src.y}, ${ENGINE_X - 30} ${ENGINE_Y}, ${ENGINE_X + 30} ${ENGINE_Y} C ${SINK_X - 30} ${ENGINE_Y}, ${SINK_X - 90} ${sink.y}, ${SINK_X - 24} ${sink.y}`}
            stroke="var(--border)"
            strokeWidth="0.5"
            fill="none"
            opacity="0.4"
          />
        )),
      )}

      {SOURCES.map((src) => (
        <g key={src.kind}>
          <circle
            cx={SOURCE_X}
            cy={src.y}
            r="14"
            fill="var(--background-elev)"
            stroke={KIND_COLOR[src.kind]}
            strokeWidth="1.5"
          />
          <circle cx={SOURCE_X} cy={src.y} r="3" fill={KIND_COLOR[src.kind]} />
          <text
            x={SOURCE_X - 24}
            y={src.y + 4}
            fontSize="10"
            fontFamily="var(--font-mono)"
            fill="var(--foreground-muted)"
            textAnchor="end"
          >
            {src.label}
          </text>
        </g>
      ))}

      <g>
        <motion.rect
          x={ENGINE_X - 36}
          y={ENGINE_Y - 28}
          width={72}
          height={56}
          rx="8"
          fill="var(--background-elev)"
          stroke="var(--accent)"
          strokeWidth="1.5"
          key={`engine-${enginePulse}`}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 0.4, ease: [0.25, 1, 0.35, 1] }}
          style={{ transformOrigin: `${ENGINE_X}px ${ENGINE_Y}px` }}
        />
        <text
          x={ENGINE_X}
          y={ENGINE_Y - 4}
          fontSize="10"
          fontFamily="var(--font-mono)"
          fill="var(--accent)"
          textAnchor="middle"
          fontWeight="500"
        >
          ENGINE
        </text>
        <text
          x={ENGINE_X}
          y={ENGINE_Y + 10}
          fontSize="8"
          fontFamily="var(--font-mono)"
          fill="var(--foreground-subtle)"
          textAnchor="middle"
        >
          evaluate()
        </text>
      </g>

      {SINKS.map((sink) => (
        <g key={sink.kind}>
          <rect
            x={SINK_X - 14}
            y={sink.y - 10}
            width={28}
            height={20}
            rx="3"
            fill="var(--background-elev)"
            stroke="var(--border-strong)"
            strokeWidth="1"
          />
          <text
            x={SINK_X + 24}
            y={sink.y + 4}
            fontSize="10"
            fontFamily="var(--font-mono)"
            fill="var(--foreground-muted)"
          >
            {sink.label}
          </text>
        </g>
      ))}

      <AnimatePresence>
        {inflight.map((evt) => {
          const pathId = `path-${evt.kind}-${evt.action}`;
          return (
            <motion.circle
              key={evt.id}
              r="4"
              fill={KIND_COLOR[evt.kind]}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0.9] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6, ease: "easeInOut" }}
              onAnimationComplete={() => removeEvent(evt.id)}
              style={{ filter: `drop-shadow(0 0 4px ${KIND_COLOR[evt.kind]})` }}
            >
              <animateMotion
                dur="1.6s"
                repeatCount="1"
                fill="freeze"
              >
                <mpath href={`#${pathId}`} />
              </animateMotion>
            </motion.circle>
          );
        })}
      </AnimatePresence>
    </svg>
  );

  if (isStrip) {
    return (
      <div className={cn("relative w-full", className)}>
        <TelemetryStrip
          items={[
            {
              label: t("feedHeader"),
              value: decisionsTotal.toString().padStart(4, "0"),
              live: true,
            },
            { label: "IN-FLIGHT", value: inflight.length.toString() },
            { label: t("uptimeLabel"), value: formatUptime(uptimeSec) },
          ]}
        />
        <div className="w-full">{svg}</div>
        <div className="accent-rule mt-2" />
        <div className="mt-3 text-left text-[11px] font-mono uppercase tracking-wider text-foreground-subtle">
          {t("feedSubLabel")}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative w-full", className)}>
      {svg}
      <div className="mt-3 flex items-center justify-between text-xs font-mono text-foreground-subtle">
        <span>{t("label")}</span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          {inflight.length} {t("inFlight")}
        </span>
      </div>
    </div>
  );
}

function StaticDiagram({
  className,
  variant = "card",
}: {
  className?: string;
  variant?: Variant;
}) {
  const t = useTranslations("LiveSimulation");
  const isStrip = variant === "strip";
  const svg = (
    <svg
      viewBox="0 0 480 340"
      className={cn(
        "w-full h-auto",
        isStrip && "min-h-[340px] md:min-h-[380px] lg:min-h-[420px]",
      )}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Decision engine architecture: events flow from sources through an engine to action sinks."
    >
      {SOURCES.map((src) => (
        <g key={src.kind}>
          <line
            x1={SOURCE_X + 14}
            y1={src.y}
            x2={ENGINE_X - 36}
            y2={ENGINE_Y}
            stroke="var(--border)"
            strokeWidth="1"
          />
          <circle cx={SOURCE_X} cy={src.y} r="14" fill="var(--background-elev)" stroke={KIND_COLOR[src.kind]} strokeWidth="1.5" />
          <circle cx={SOURCE_X} cy={src.y} r="3" fill={KIND_COLOR[src.kind]} />
          <text x={SOURCE_X - 24} y={src.y + 4} fontSize="10" fontFamily="var(--font-mono)" fill="var(--foreground-muted)" textAnchor="end">{src.label}</text>
        </g>
      ))}
      <rect x={ENGINE_X - 36} y={ENGINE_Y - 28} width={72} height={56} rx="8" fill="var(--background-elev)" stroke="var(--accent)" strokeWidth="1.5" />
      <text x={ENGINE_X} y={ENGINE_Y - 4} fontSize="10" fontFamily="var(--font-mono)" fill="var(--accent)" textAnchor="middle" fontWeight="500">ENGINE</text>
      <text x={ENGINE_X} y={ENGINE_Y + 10} fontSize="8" fontFamily="var(--font-mono)" fill="var(--foreground-subtle)" textAnchor="middle">evaluate()</text>
      {SINKS.map((sink) => (
        <g key={sink.kind}>
          <line
            x1={ENGINE_X + 36}
            y1={ENGINE_Y}
            x2={SINK_X - 14}
            y2={sink.y}
            stroke="var(--border)"
            strokeWidth="1"
          />
          <rect x={SINK_X - 14} y={sink.y - 10} width={28} height={20} rx="3" fill="var(--background-elev)" stroke="var(--border-strong)" strokeWidth="1" />
          <text x={SINK_X + 24} y={sink.y + 4} fontSize="10" fontFamily="var(--font-mono)" fill="var(--foreground-muted)">{sink.label}</text>
        </g>
      ))}
    </svg>
  );

  if (isStrip) {
    return (
      <div className={cn("relative w-full", className)}>
        <TelemetryStrip
          items={[
            { label: t("feedHeader"), value: "STATIC", live: false },
            { label: "IN-FLIGHT", value: "0" },
            { label: t("uptimeLabel"), value: "—" },
          ]}
        />
        <div className="w-full">{svg}</div>
        <div className="accent-rule mt-2" />
        <div className="mt-3 text-left text-[11px] font-mono uppercase tracking-wider text-foreground-subtle">
          {t("reducedMotion")}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative w-full", className)}>
      {svg}
      <div className="mt-3 text-xs font-mono text-foreground-subtle">
        {t("reducedMotion")}
      </div>
    </div>
  );
}
