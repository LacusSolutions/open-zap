"use client";

import { useTranslations } from "next-intl";
import type { ReactElement } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import type { FormValues } from "@/lib/schema";
import { MAX_MESSAGE_LENGTH } from "@/lib/whatsapp";

export function MessageField(): ReactElement {
  const t = useTranslations("form.message");
  const { control, watch } = useFormContext<FormValues>();
  const value = watch("text") ?? "";

  return (
    <div>
      <div className="flex items-end justify-between">
        <Label htmlFor="text">{t("label")}</Label>
        <span
          aria-live="polite"
          className="mb-1.5 text-xs text-[var(--color-text-muted)] tabular-nums"
        >
          {t("counter", { count: value.length, max: MAX_MESSAGE_LENGTH })}
        </span>
      </div>
      <Controller
        control={control}
        name="text"
        render={({ field }) => (
          <Textarea
            id="text"
            placeholder={t("placeholder")}
            maxLength={MAX_MESSAGE_LENGTH}
            rows={5}
            {...field}
          />
        )}
      />
      <p className="mt-1 text-xs text-[var(--color-text-muted)]">{t("help")}</p>
    </div>
  );
}
