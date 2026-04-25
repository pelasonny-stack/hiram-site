"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Eyebrow } from "@/components/marketing/section";
import { ContactForm } from "@/components/forms/contact-form";
import { JsonPayloadPreview } from "@/components/forms/json-payload-preview";
import type { ContactRequest } from "@/lib/ai/schemas";

export function ContactPageClient() {
  const t = useTranslations("Contact");
  const steps = t.raw("steps") as string[];

  const [payload, setPayload] = React.useState<Partial<ContactRequest>>({});

  return (
    <div className="grid gap-12 lg:grid-cols-12">
      <div className="space-y-12 lg:col-span-7">
        <header className="space-y-6">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h1 className="text-h1 max-w-[18ch]">{t("headline")}</h1>
          <p className="max-w-prose text-lg text-foreground-muted leading-relaxed">
            {t("lede")}
          </p>
        </header>
        <ContactForm onChange={setPayload} />
      </div>

      <aside className="lg:col-span-5">
        <div className="space-y-6 lg:sticky lg:top-24">
          <JsonPayloadPreview
            data={payload as Record<string, unknown>}
          />
          <div className="rounded-xl border border-border bg-background-elev/40 p-6 md:p-8">
            <Eyebrow>{t("nextSteps")}</Eyebrow>
            <ol className="mt-6 space-y-6">
              {steps.map((body, i) => {
                const n = String(i + 1).padStart(2, "0");
                return (
                  <li key={n} className="flex gap-4">
                    <span className="font-mono text-sm text-accent shrink-0">
                      {n}
                    </span>
                    <p className="text-sm text-foreground-muted leading-relaxed">
                      {body}
                    </p>
                  </li>
                );
              })}
            </ol>
          </div>
          <p className="px-2 font-mono text-xs text-foreground-subtle">
            {t("trust")}
          </p>
        </div>
      </aside>
    </div>
  );
}
