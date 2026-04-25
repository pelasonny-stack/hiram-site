"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  type EventKind,
  KIND_COLOR,
  pickRandomKind,
} from "@/lib/simulation/synthetic";

// Drop "signup" — only 3 kinds for this mini.
const KINDS = ["payment", "churn_signal", "fraud_probe"] as const satisfies readonly EventKind[];

type SinkKey = "sink_a" | "sink_b" | "dlq";

const SOURCE_X = 40;
const BROKER_X = 200;
const BROKER_Y = 120;
const BROKER_W = 80;
const BROKER_H = 60;
const SINK_X = 360;

const SOURCES: { kind: EventKind; y: number; label: string }[] = [
  { kind: "payment", y: 40, label: "payment" },
  { kind: "churn_signal", y: 120, label: "churn" },
  { kind: "fraud_probe", y: 200, label: "fraud" },
];

const SINKS: { key: SinkKey; y: number; label: string; danger?: boolean }[] = [
  { key: "sink_a", y: 60, label: "cg.decide" },
  { key: "sink_b", y: 180, label: "cg.audit" },
];

const DLQ_Y = 200;

function routeFor(kind: EventKind): SinkKey {
  // ~12% spill to DLQ, otherwise route mostly by kind
  if (Math.random() < 0.12) return "dlq";
  if (kind === "fraud_probe") return Math.random() > 0.5 ? "sink_a" : "sink_b";
  if (kind === "payment") return "sink_a";
  return "sink_b";
}

interface Particle {
  id: number;
  kind: EventKind;
  sink: SinkKey;
  startedAt: number;
}

export function MiniTopology() {
  const t = useTranslations("Capabilities.miniTopology");
  const reduce = useReducedMotion();
  const [particles, setParticles] = React.useState<Particle[]>([]);
  const [brokerPulse, setBrokerPulse] = React.useState(0);
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
    if (reduce) return;
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      if (!visibleRef.current) {
        setTimeout(tick, 1000);
        return;
      }
      setParticles((cur) => {
        if (cur.length >= 6) return cur;
        const kind = pickRandomKind(KINDS);
        const sink = routeFor(kind);
        const id = ++idRef.current;
        setBrokerPulse((p) => p + 1);
        return [...cur, { id, kind, sink, startedAt: Date.now() }];
      });
      setTimeout(tick, 800 + Math.random() * 700);
    };
    const t = setTimeout(tick, 400);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [reduce]);

  const remove = React.useCallback((id: number) => {
    setParticles((cur) => cur.filter((p) => p.id !== id));
  }, []);

  return (
    <div className="corner-accent border border-border bg-background-elev/40 rounded-md p-5 space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <div className="text-eyebrow text-accent">{t("title")}</div>
        <span className="font-mono text-[10px] text-foreground-subtle">
          {t("subtitle")}
        </span>
      </div>

      <TooltipProvider>
        <svg
          viewBox="0 0 400 240"
          className="w-full h-auto"
          role="img"
          aria-label="Event topology: three sources flow into a broker, then to two sinks plus a dead-letter queue."
        >
          <defs>
            {SOURCES.map((src) =>
              ([...SINKS.map((s) => s.key), "dlq"] as SinkKey[]).map((sk) => {
                const target =
                  sk === "dlq"
                    ? { x: SINK_X, y: DLQ_Y }
                    : { x: SINK_X, y: SINKS.find((s) => s.key === sk)!.y };
                const id = `mt-path-${src.kind}-${sk}`;
                const d = `M ${SOURCE_X + 18} ${src.y} C ${SOURCE_X + 80} ${src.y}, ${BROKER_X - 20} ${BROKER_Y + 30}, ${BROKER_X + BROKER_W / 2} ${BROKER_Y + BROKER_H / 2} C ${BROKER_X + BROKER_W + 20} ${BROKER_Y + 30}, ${SINK_X - 80} ${target.y}, ${target.x - 18} ${target.y}`;
                return <path key={id} id={id} d={d} fill="none" />;
              }),
            )}
          </defs>

          {/* Background paths */}
          {SOURCES.map((src) =>
            ([...SINKS.map((s) => s.key), "dlq"] as SinkKey[]).map((sk) => {
              const target =
                sk === "dlq"
                  ? { x: SINK_X, y: DLQ_Y }
                  : { x: SINK_X, y: SINKS.find((s) => s.key === sk)!.y };
              return (
                <path
                  key={`mt-bg-${src.kind}-${sk}`}
                  d={`M ${SOURCE_X + 18} ${src.y} C ${SOURCE_X + 80} ${src.y}, ${BROKER_X - 20} ${BROKER_Y + 30}, ${BROKER_X + BROKER_W / 2} ${BROKER_Y + BROKER_H / 2} C ${BROKER_X + BROKER_W + 20} ${BROKER_Y + 30}, ${SINK_X - 80} ${target.y}, ${target.x - 18} ${target.y}`}
                  stroke="var(--border)"
                  strokeWidth="0.5"
                  fill="none"
                  opacity="0.4"
                  strokeDasharray={sk === "dlq" ? "3 2" : undefined}
                />
              );
            }),
          )}

          {/* Sources */}
          {SOURCES.map((src) => (
            <g key={src.kind}>
              <circle
                cx={SOURCE_X}
                cy={src.y}
                r="12"
                fill="var(--background-elev)"
                stroke={KIND_COLOR[src.kind]}
                strokeWidth="1.5"
              />
              <circle cx={SOURCE_X} cy={src.y} r="3" fill={KIND_COLOR[src.kind]} />
              <text
                x={SOURCE_X - 18}
                y={src.y + 3}
                fontSize="9"
                fontFamily="var(--font-mono)"
                fill="var(--foreground-muted)"
                textAnchor="end"
              >
                {src.label}
              </text>
            </g>
          ))}

          {/* Broker (with tooltip trigger) */}
          <g>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.rect
                  x={BROKER_X}
                  y={BROKER_Y}
                  width={BROKER_W}
                  height={BROKER_H}
                  rx="6"
                  fill="var(--background-elev)"
                  stroke="var(--accent)"
                  strokeWidth="1.5"
                  key={`broker-${brokerPulse}`}
                  initial={{ scale: 1 }}
                  animate={reduce ? undefined : { scale: [1, 1.04, 1] }}
                  transition={{ duration: 0.4, ease: [0.25, 1, 0.35, 1] }}
                  style={{
                    transformOrigin: `${BROKER_X + BROKER_W / 2}px ${BROKER_Y + BROKER_H / 2}px`,
                    cursor: "pointer",
                    outline: "none",
                  }}
                  tabIndex={0}
                  aria-label={t("exactlyOnceBadge")}
                />
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-background-elev border border-accent/40 text-accent font-mono text-[11px]"
              >
                {t("exactlyOnceBadge")}
              </TooltipContent>
            </Tooltip>
            <text
              x={BROKER_X + BROKER_W / 2}
              y={BROKER_Y + BROKER_H / 2 - 2}
              fontSize="11"
              fontFamily="var(--font-mono)"
              fill="var(--accent)"
              textAnchor="middle"
              fontWeight="500"
              pointerEvents="none"
            >
              broker
            </text>
            <text
              x={BROKER_X + BROKER_W / 2}
              y={BROKER_Y + BROKER_H / 2 + 12}
              fontSize="8"
              fontFamily="var(--font-mono)"
              fill="var(--foreground-subtle)"
              textAnchor="middle"
              pointerEvents="none"
            >
              events.v3
            </text>
          </g>

          {/* Sinks */}
          {SINKS.map((sink) => (
            <g key={sink.key}>
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
                x={SINK_X + 22}
                y={sink.y + 3}
                fontSize="9"
                fontFamily="var(--font-mono)"
                fill="var(--foreground-muted)"
              >
                {sink.label}
              </text>
            </g>
          ))}

          {/* DLQ */}
          <g>
            <rect
              x={SINK_X - 14}
              y={DLQ_Y - 10}
              width={28}
              height={20}
              rx="3"
              fill="var(--background-elev)"
              stroke="var(--danger)"
              strokeWidth="1"
              strokeDasharray="3 2"
            />
            <text
              x={SINK_X + 22}
              y={DLQ_Y + 3}
              fontSize="9"
              fontFamily="var(--font-mono)"
              fill="var(--danger)"
            >
              dlq
            </text>
          </g>

          {/* Particles */}
          {!reduce && (
            <AnimatePresence>
              {particles.map((p) => {
                const pathId = `mt-path-${p.kind}-${p.sink}`;
                const color =
                  p.sink === "dlq" ? "var(--danger)" : KIND_COLOR[p.kind];
                return (
                  <motion.circle
                    key={p.id}
                    r="3.5"
                    fill={color}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 1, 0.9] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.6, ease: "easeInOut" }}
                    onAnimationComplete={() => remove(p.id)}
                    style={{ filter: `drop-shadow(0 0 3px ${color})` }}
                  >
                    <animateMotion dur="1.6s" repeatCount="1" fill="freeze">
                      <mpath href={`#${pathId}`} />
                    </animateMotion>
                  </motion.circle>
                );
              })}
            </AnimatePresence>
          )}

          {/* Static dots when reduced motion */}
          {reduce && (
            <>
              {SOURCES.map((src) => (
                <circle
                  key={`static-${src.kind}`}
                  cx={BROKER_X + BROKER_W / 2}
                  cy={BROKER_Y + BROKER_H / 2}
                  r="2.5"
                  fill={KIND_COLOR[src.kind]}
                  opacity="0.6"
                />
              ))}
            </>
          )}
        </svg>
      </TooltipProvider>

      <p className="font-mono text-[10px] text-foreground-subtle leading-relaxed">
        {t("hint")}
      </p>
    </div>
  );
}
