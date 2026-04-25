import * as React from "react";

export type SchematicVariant = "shield" | "scale" | "bars" | "dots";

export function CaseSchematic({
  variant,
  className,
  size = 40,
}: {
  variant: SchematicVariant;
  className?: string;
  size?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 40 40",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (variant === "shield") {
    return (
      <svg {...common} className={className}>
        <path d="M20 5 L33 10 V20 C33 27 27 33 20 35 C13 33 7 27 7 20 V10 Z" />
        <circle cx="20" cy="20" r="2.2" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (variant === "scale") {
    return (
      <svg {...common} className={className}>
        <line x1="20" y1="6" x2="20" y2="34" />
        <line x1="8" y1="14" x2="32" y2="14" />
        <path d="M8 14 L4 24 L12 24 Z" />
        <path d="M32 14 L28 24 L36 24 Z" />
        <line x1="14" y1="34" x2="26" y2="34" />
      </svg>
    );
  }
  if (variant === "bars") {
    return (
      <svg {...common} className={className}>
        <line x1="6" y1="34" x2="34" y2="34" />
        <rect x="9" y="24" width="6" height="10" />
        <rect x="17" y="18" width="6" height="16" />
        <rect x="25" y="10" width="6" height="24" />
      </svg>
    );
  }
  return (
    <svg {...common} className={className}>
      <circle cx="10" cy="20" r="2.5" />
      <circle cx="20" cy="20" r="2.5" />
      <circle cx="30" cy="20" r="2.5" />
    </svg>
  );
}

export function schematicForSlug(slug: string): SchematicVariant {
  if (slug === "telco-latam-fraud") return "shield";
  if (slug === "fintech-eu-credit") return "scale";
  if (slug === "retail-na-pricing") return "bars";
  return "dots";
}
