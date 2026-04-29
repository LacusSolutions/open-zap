"use client";

import { useLocale, useTranslations } from "next-intl";
import { type ReactElement, useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import {
  type CountryCode,
  getFlagEmoji,
  getSortedCountries,
  isValidFor,
  localizedCountryName,
} from "@/lib/phone";
import type { FormValues } from "@/lib/schema";

interface PhoneFieldProps {
  required?: boolean;
}

export function PhoneField({ required }: PhoneFieldProps): ReactElement {
  const t = useTranslations("form.phone");
  const locale = useLocale();
  const { control, watch, formState } = useFormContext<FormValues>();
  const countries = useMemo(() => getSortedCountries(), []);
  const country = watch("country") as CountryCode;
  const phone = watch("phone");
  const showError =
    required &&
    !!phone &&
    !isValidFor(phone, country) &&
    !!formState.submitCount;

  return (
    <fieldset className="grid gap-3 sm:grid-cols-[minmax(10rem,14rem)_1fr]">
      <div>
        <Label htmlFor="country">{t("countryLabel")}</Label>
        <Controller
          control={control}
          name="country"
          render={({ field }) => (
            <Select id="country" {...field}>
              {countries.map((c) => {
                const name = localizedCountryName(c.code, locale);

                return (
                  <option key={c.code} value={c.code} suppressHydrationWarning>
                    {getFlagEmoji(c.code)} {name} ({c.dialCode})
                  </option>
                );
              })}
            </Select>
          )}
        />
      </div>
      <div>
        <Label htmlFor="phone">{t("label")}</Label>
        <Controller
          control={control}
          name="phone"
          render={({ field }) => (
            <Input
              id="phone"
              inputMode="tel"
              autoComplete="tel"
              placeholder={t("placeholder")}
              invalid={showError}
              {...field}
            />
          )}
        />
        <p
          id="phone-help"
          className={`mt-1 text-xs ${showError ? "text-red-500" : "text-[var(--color-text-muted)]"}`}
        >
          {showError ? t("invalid") : t("help")}
        </p>
      </div>
    </fieldset>
  );
}
