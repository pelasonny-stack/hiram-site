"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ParsedValue {
  prefix: string;
  number: number | null;
  suffix: string;
}

function parseValue(raw: string): ParsedValue {
  const match = raw.match(/^(\D*)([\d.,]+)(.*)$/);
  if (!match) return { prefix: "", number: null, suffix: raw };
  const numStr = match[2]!.replace(/,/g, "");
  const n = Number(numStr);
  if (!isFinite(n)) return { prefix: "", number: null, suffix: raw };
  return { prefix: match[1] ?? "", number: n, suffix: match[3] ?? "" };
}

export function AnimatedStat({
  value,
  label,
  className,
  duration = 1100,
}: {
  value: string;
  label: string;
  className?: string;
  duration?: number;
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const parsed = React.useMemo(() => parseValue(value), [value]);
  const [display, setDisplay] = React.useState(parsed.number === null ? value : `${parsed.prefix}0${parsed.suffix}`);

  React.useEffect(() => {
    const node = ref.current;
    if (!node || parsed.number === null) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDisplay(value);
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const start = performance.now();
          const target = parsed.number!;
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            const cur = target * eased;
            const formatted =
              target >= 1
                ? cur >= 10
                  ? Math.round(cur).toString()
                  : cur.toFixed(1).replace(/\.0$/, "")
                : cur.toFixed(2);
            setDisplay(`${parsed.prefix}${formatted}${parsed.suffix}`);
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          obs.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [parsed, value, duration]);

  return (
    <div ref={ref} className={cn("space-y-3", className)}>
      <div className="font-mono text-4xl font-medium tracking-tight text-accent md:text-5xl lg:text-6xl">
        {display}
      </div>
      <div className="text-sm text-foreground-muted max-w-[28ch]">{label}</div>
    </div>
  );
}
