"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Check, Copy } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ANALYZER_SYSTEM, analyzerUserMessage } from "@/lib/ai/prompts";
import { cn } from "@/lib/utils";

export function PromptSheet({
  problem,
  trigger,
}: {
  problem: string;
  trigger: React.ReactNode;
}) {
  const t = useTranslations("Demo.promptSheet");
  const [copied, setCopied] = React.useState(false);

  const userMessage = analyzerUserMessage(problem || "<your problem here>");

  const curl = `curl https://api.anthropic.com/v1/messages \\
  -H "content-type: application/json" \\
  -H "x-api-key: $ANTHROPIC_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -d '${JSON.stringify(
    {
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1200,
      temperature: 0.4,
      system: [
        {
          type: "text",
          text: "<see SYSTEM_PROMPT panel>",
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: userMessage }],
    },
    null,
    2,
  )
    .replace(/\n/g, "\n  ")
    .replace(/'/g, "'\\''")}'`;

  async function copyAsCurl() {
    try {
      await navigator.clipboard.writeText(curl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* swallow */
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl overflow-hidden p-0 bg-background border-l border-border"
      >
        <SheetHeader className="space-y-2 border-b border-border bg-background-elev/40 px-6 py-5">
          <SheetTitle className="text-h3">{t("title")}</SheetTitle>
          <SheetDescription className="text-foreground-muted">
            {t("subtitle")}
          </SheetDescription>
          <div className="pt-2">
            <Button
              variant="terminal"
              size="sm"
              onClick={copyAsCurl}
              className="gap-2"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? t("copied") : t("copyAsCurl")}
            </Button>
          </div>
        </SheetHeader>

        <div className="h-[calc(100%-9rem)] overflow-auto">
          <PromptBlock label={t("systemPrompt")} body={ANALYZER_SYSTEM} />
          <PromptBlock label={t("userMessage")} body={userMessage} accent />
        </div>
      </SheetContent>
    </Sheet>
  );
}

function PromptBlock({
  label,
  body,
  accent,
}: {
  label: string;
  body: string;
  accent?: boolean;
}) {
  return (
    <section>
      <header className="sticky top-0 z-10 border-b border-border bg-background-elev/80 px-6 py-2 font-mono text-[10px] uppercase tracking-wider text-foreground-subtle backdrop-blur">
        {label}
      </header>
      <pre
        className={cn(
          "whitespace-pre-wrap break-words px-6 py-5 font-mono text-[12px] leading-relaxed",
          accent ? "text-accent" : "text-foreground",
        )}
      >
        {body}
      </pre>
    </section>
  );
}
