import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <main className="container-shell flex min-h-screen flex-col items-center justify-center gap-8 text-center">
      <div className="space-y-4">
        <div className="text-eyebrow text-accent">{t("code")}</div>
        <h1 className="text-h1 max-w-xl mx-auto">{t("headline")}</h1>
        <p className="max-w-md mx-auto text-foreground-muted leading-relaxed">
          {t("body")}
        </p>
      </div>

      <div className="w-full max-w-md overflow-hidden rounded-md border border-border bg-background-elev/40 text-left">
        <div className="flex items-center gap-2 border-b border-border bg-background-elev/60 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-foreground-subtle">
          <span className="pulse-dot text-accent" aria-hidden />
          <span>{t("payloadHeader")}</span>
        </div>
        <pre className="px-4 py-4 font-mono text-xs leading-relaxed text-foreground">
          <span>{"{"}</span>
          {"\n  "}
          <span className="text-foreground-muted">{`"verdict"`}</span>
          <span>: </span>
          <span className="text-accent">{`"${t("payloadVerdict")}"`}</span>
          <span>,</span>
          {"\n  "}
          <span className="text-foreground-muted">{`"confidence"`}</span>
          <span>: </span>
          <span className="text-warning">0.99</span>
          <span>,</span>
          {"\n  "}
          <span className="text-foreground-muted">{`"action"`}</span>
          <span>: </span>
          <span className="text-accent">{`"${t("payloadAction")}"`}</span>
          {"\n"}
          <span>{"}"}</span>
        </pre>
      </div>

      <Link
        href="/"
        className="text-eyebrow text-accent underline-sweep py-1"
      >
        → {t("back")}
      </Link>
    </main>
  );
}
