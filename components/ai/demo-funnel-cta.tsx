"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DemoFunnelCtaProps {
  visible: boolean;
  className?: string;
}

export function DemoFunnelCta({ visible, className }: DemoFunnelCtaProps) {
  const t = useTranslations("DemoFunnelCta");

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "transition-opacity duration-200",
        visible
          ? "opacity-100"
          : "pointer-events-none opacity-0",
        className,
      )}
    >
      <div className="corner-accent accent-rule border border-accent-muted bg-accent/5 p-6 md:p-8 relative">
        <div className="absolute right-6 top-6">
          <span className="pulse-dot font-mono text-[10px] uppercase tracking-wider text-accent" />
        </div>
        <h3 className="text-h3 max-w-[26ch]">{t("title")}</h3>
        <p className="mt-3 max-w-prose text-base text-foreground-muted leading-relaxed">
          {t("body")}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button asChild size="lg">
            <Link href="/contact">{t("primary")}</Link>
          </Button>
          <Button asChild variant="quiet" size="lg" className="font-mono">
            <Link href="/pricing">{t("secondary")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
