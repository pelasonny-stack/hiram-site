import * as React from "react";
import { cn } from "@/lib/utils";

export function Section({
  id,
  children,
  className,
  bleed = false,
  as: Tag = "section",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  bleed?: boolean;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  return (
    <Tag
      id={id}
      className={cn(
        "py-20 md:py-28 lg:py-36",
        bleed && "bg-background-elev/40 border-y border-border",
        className,
      )}
    >
      <div className="container-shell">{children}</div>
    </Tag>
  );
}

export function Eyebrow({
  children,
  className,
  accent = false,
}: {
  children: React.ReactNode;
  className?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "text-eyebrow",
        accent ? "text-accent" : "text-foreground-subtle",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Stat({
  value,
  label,
  className,
}: {
  value: string;
  label: string;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="font-mono text-4xl font-medium text-accent md:text-5xl lg:text-6xl">
        {value}
      </div>
      <div className="text-sm text-foreground-muted max-w-[28ch]">{label}</div>
    </div>
  );
}

export function GridBg({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 grid-bg", className)}
    />
  );
}
