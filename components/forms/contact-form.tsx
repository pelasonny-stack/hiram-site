"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { contactRequestSchema, type ContactRequest } from "@/lib/ai/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eyebrow } from "@/components/marketing/section";
import { cn } from "@/lib/utils";

const ROLE_VALUES = [
  "engineering",
  "product",
  "data_ml",
  "founder_clevel",
  "other",
] as const;

const STAGE_VALUES = [
  "exploring",
  "building_internal",
  "live_needs_scale",
  "just_curious",
] as const;

const EVENT_VOLUME_VALUES = [
  "lt_100k",
  "100k_1m",
  "1m_10m",
  "10m_100m",
  "gt_100m",
  "unknown",
] as const;

const TIMELINE_VALUES = [
  "urgent",
  "1_3_months",
  "3_6_months",
  "6_plus",
] as const;

const BUDGET_VALUES = [
  "lt_30k",
  "30_80k",
  "80_200k",
  "200k_plus",
  "unknown",
] as const;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-danger text-xs mt-1.5">{message}</p>;
}

function FormSection({
  eyebrow,
  children,
}: {
  eyebrow: string;
  children: React.ReactNode;
}) {
  // Convert dictionary "01 // LABEL" → "[01] LABEL" CLI style
  const formatted = eyebrow.replace(/^(\d+)\s*\/\/\s*/, "[$1] ");
  return (
    <div className="space-y-6 border-t border-border pt-10 first:border-t-0 first:pt-0">
      <div className="font-mono text-xs uppercase tracking-wider text-foreground-subtle">
        <span className="text-accent">{formatted.match(/^\[\d+\]/)?.[0] ?? ""}</span>
        <span className="text-foreground-muted">{" "}{formatted.replace(/^\[\d+\]\s*/, "")}</span>
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  );
}

function CliLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <Label
      htmlFor={htmlFor}
      className="font-mono text-xs uppercase tracking-wider text-foreground-muted gap-1.5"
    >
      <span className="text-accent">{">"}</span>
      <span>{children}</span>
    </Label>
  );
}

interface ContactFormProps {
  onChange?: (values: Partial<ContactRequest>) => void;
}

export function ContactForm({ onChange }: ContactFormProps = {}) {
  const t = useTranslations("Contact.form");
  const [submitted, setSubmitted] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactRequest>({
    resolver: zodResolver(contactRequestSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      role: undefined,
      problem: "",
      stage: undefined,
      eventVolume: undefined,
      timeline: undefined,
      budget: undefined,
      source: "",
      notes: "",
      honeypot: "",
    },
    mode: "onBlur",
  });

  const problemValue = watch("problem") ?? "";

  // Forward live form values up to parent (for the JSON payload preview).
  // We strip `honeypot` here so consumers never see it.
  React.useEffect(() => {
    if (!onChange) return;
    const sub = watch((values) => {
      const { honeypot: _ignored, ...rest } = values as ContactRequest;
      onChange(rest);
    });
    return () => sub.unsubscribe();
  }, [watch, onChange]);

  async function onSubmit(values: ContactRequest) {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        toast.error(data.error ?? t("errorGeneric"));
        return;
      }
      setSubmitted(true);
    } catch {
      toast.error(t("errorGeneric"));
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-border bg-background-elev/40 p-8 md:p-10">
        <div className="flex items-start gap-4">
          <CheckCircle2 className="size-8 shrink-0 text-accent" aria-hidden />
          <div className="space-y-3">
            <h2 className="text-h2">{t("successHeadline")}</h2>
            <p className="max-w-prose text-foreground-muted leading-relaxed">
              {t("successBody")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-12"
      aria-label="Contact form"
    >
      {/* Honeypot — visually hidden */}
      <div
        aria-hidden="true"
        className="absolute h-0 w-0 overflow-hidden opacity-0"
        style={{ position: "absolute", left: "-9999px" }}
      >
        <label>
          Leave this field empty
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register("honeypot")}
          />
        </label>
      </div>

      <FormSection eyebrow={t("section1")}>
        <div className="space-y-2">
          <CliLabel htmlFor="name">{t("name")}</CliLabel>
          <Input
            id="name"
            type="text"
            autoComplete="name"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
          <FieldError message={errors.name?.message} />
        </div>

        <div className="space-y-2">
          <CliLabel htmlFor="email">{t("email")}</CliLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          <FieldError message={errors.email?.message} />
        </div>

        <div className="space-y-2">
          <CliLabel htmlFor="company">{t("company")}</CliLabel>
          <Input
            id="company"
            type="text"
            autoComplete="organization"
            aria-invalid={!!errors.company}
            {...register("company")}
          />
          <FieldError message={errors.company?.message} />
        </div>

        <div className="space-y-2">
          <CliLabel htmlFor="role">{t("role")}</CliLabel>
          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <Select
                value={field.value ?? ""}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  id="role"
                  className="w-full"
                  aria-invalid={!!errors.role}
                >
                  <SelectValue placeholder={t("rolePlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_VALUES.map((v) => (
                    <SelectItem key={v} value={v}>
                      {t(`roles.${v}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError message={errors.role?.message} />
        </div>
      </FormSection>

      <FormSection eyebrow={t("section2")}>
        <div className="space-y-2">
          <CliLabel htmlFor="problem">{t("problem")}</CliLabel>
          <Textarea
            id="problem"
            rows={6}
            placeholder={t("problemPlaceholder")}
            aria-invalid={!!errors.problem}
            {...register("problem")}
          />
          <div className="flex items-center justify-between">
            <FieldError message={errors.problem?.message} />
            <span
              className={cn(
                "ml-auto font-mono text-xs",
                problemValue.length > 2000 || problemValue.length < 60
                  ? "text-foreground-subtle"
                  : "text-foreground-muted",
              )}
            >
              {problemValue.length} / 2000
            </span>
          </div>
        </div>
      </FormSection>

      <FormSection eyebrow={t("section3")}>
        <div className="space-y-2">
          <CliLabel htmlFor="stage">{t("stage")}</CliLabel>
          <Controller
            control={control}
            name="stage"
            render={({ field }) => (
              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                <SelectTrigger
                  id="stage"
                  className="w-full"
                  aria-invalid={!!errors.stage}
                >
                  <SelectValue placeholder={t("stagePlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {STAGE_VALUES.map((v) => (
                    <SelectItem key={v} value={v}>
                      {t(`stages.${v}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError message={errors.stage?.message} />
        </div>

        <div className="space-y-2">
          <CliLabel htmlFor="eventVolume">{t("eventVolume")}</CliLabel>
          <Controller
            control={control}
            name="eventVolume"
            render={({ field }) => (
              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                <SelectTrigger
                  id="eventVolume"
                  className="w-full"
                  aria-invalid={!!errors.eventVolume}
                >
                  <SelectValue placeholder={t("eventVolumePlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_VOLUME_VALUES.map((v) => (
                    <SelectItem key={v} value={v}>
                      {t(`eventVolumes.${v}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError message={errors.eventVolume?.message} />
        </div>

        <div className="space-y-2">
          <CliLabel htmlFor="timeline">{t("timeline")}</CliLabel>
          <Controller
            control={control}
            name="timeline"
            render={({ field }) => (
              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                <SelectTrigger
                  id="timeline"
                  className="w-full"
                  aria-invalid={!!errors.timeline}
                >
                  <SelectValue placeholder={t("timelinePlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {TIMELINE_VALUES.map((v) => (
                    <SelectItem key={v} value={v}>
                      {t(`timelines.${v}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError message={errors.timeline?.message} />
        </div>

        <div className="space-y-2">
          <CliLabel htmlFor="budget">{t("budget")}</CliLabel>
          <Controller
            control={control}
            name="budget"
            render={({ field }) => (
              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                <SelectTrigger
                  id="budget"
                  className="w-full"
                  aria-invalid={!!errors.budget}
                >
                  <SelectValue placeholder={t("budgetPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {BUDGET_VALUES.map((v) => (
                    <SelectItem key={v} value={v}>
                      {t(`budgets.${v}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError message={errors.budget?.message} />
          <p className="font-mono text-xs text-foreground-subtle leading-relaxed">
            {t("budgetMicrocopy")}
          </p>
        </div>
      </FormSection>

      <FormSection eyebrow={t("section4")}>
        <div className="space-y-2">
          <CliLabel htmlFor="source">{t("source")}</CliLabel>
          <Input
            id="source"
            type="text"
            autoComplete="off"
            aria-invalid={!!errors.source}
            {...register("source")}
          />
          <FieldError message={errors.source?.message} />
        </div>

        <div className="space-y-2">
          <CliLabel htmlFor="notes">{t("notes")}</CliLabel>
          <Textarea
            id="notes"
            rows={4}
            placeholder={t("notesPlaceholder")}
            aria-invalid={!!errors.notes}
            {...register("notes")}
          />
          <FieldError message={errors.notes?.message} />
        </div>
      </FormSection>

      <div className="space-y-4 border-t border-border pt-10">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="w-full md:w-auto font-mono"
        >
          <span className="text-accent-foreground/70">$</span>{" "}
          {isSubmitting ? t("submitting") : t("submit")}
        </Button>
        <p className="font-mono text-xs text-foreground-subtle">
          {t("submitFooter")}
        </p>
      </div>
    </form>
  );
}
