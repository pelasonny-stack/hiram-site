"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { Check, Globe } from "lucide-react";
import { routing } from "@/i18n/routing";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function LocaleSwitcher({ className }: { className?: string }) {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  function onChange(next: string) {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- params shape is dynamic per route
        { pathname, params },
        { locale: next as (typeof routing.locales)[number] },
      );
    });
  }

  return (
    <Select value={locale} onValueChange={onChange} disabled={isPending}>
      <SelectTrigger
        size="sm"
        aria-label={t("label")}
        className={cn(
          "h-8 w-[68px] gap-1.5 border-border bg-transparent px-2.5 font-mono text-xs uppercase tracking-wider text-foreground-muted hover:text-foreground",
          className,
        )}
      >
        <Globe className="h-3 w-3" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end" className="min-w-[140px]">
        {routing.locales.map((l) => (
          <SelectItem key={l} value={l} className="text-sm">
            <span className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase text-foreground-subtle">
                {l}
              </span>
              <span>{t(l)}</span>
              {l === locale && <Check className="ml-auto h-3 w-3 text-accent" />}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
