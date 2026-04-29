"use client";

import { RotateCcw, Share2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { type ReactElement, useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { BusinessShortCodeField } from "@/components/generator/BusinessShortCodeField";
import { LinkVariantTabs } from "@/components/generator/LinkVariantTabs";
import { MessageField } from "@/components/generator/MessageField";
import { PhoneField } from "@/components/generator/PhoneField";
import { UtmFieldset } from "@/components/generator/UtmFieldset";
import { Button } from "@/components/ui/Button";
import { decodeFormFromParams, encodeFormToParams } from "@/lib/formState";
import { DEFAULT_VALUES, type FormValues } from "@/lib/schema";
import {
  buildWhatsAppUrl,
  type LinkVariant,
  variantRequiresPhone,
  variantRequiresShortCode,
  variantSupportsText,
  variantSupportsUtm,
} from "@/lib/whatsapp";

interface GeneratorFormProps {
  onChange: (url: string, values: FormValues) => void;
}

export function GeneratorForm({ onChange }: GeneratorFormProps): ReactElement {
  const t = useTranslations("form");
  const searchParams = useSearchParams();
  const [shared, setShared] = useState(false);

  const initialValues = useMemo<FormValues>(() => {
    const hydrated = decodeFormFromParams(searchParams);

    return { ...DEFAULT_VALUES, ...hydrated };
  }, [searchParams]);

  const methods = useForm<FormValues>({
    defaultValues: initialValues,
    mode: "onChange",
  });

  const { watch, reset, getValues } = methods;
  const values = watch();
  const variant = values.variant as LinkVariant;

  useEffect(() => {
    const url = buildWhatsAppUrl({
      variant,
      phone: variantRequiresPhone(variant) ? values.phone : undefined,
      shortCode: variantRequiresShortCode(variant)
        ? values.shortCode
        : undefined,
      text: variantSupportsText(variant) ? values.text : undefined,
      utm:
        variantSupportsUtm(variant) && values.showUtm ? values.utm : undefined,
    });
    onChange(url, values);
  }, [values, variant, onChange]);

  async function onShare(): Promise<void> {
    const params = encodeFormToParams(getValues());
    const url = `${window.location.origin}${window.location.pathname}${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    await navigator.clipboard.writeText(url);
    setShared(true);
    window.setTimeout(() => setShared(false), 2000);
  }

  return (
    <FormProvider {...methods}>
      <form
        className="flex flex-col gap-6"
        onSubmit={(e) => e.preventDefault()}
      >
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            {t("sections.destination")}
          </h2>
          <LinkVariantTabs
            value={variant}
            onChange={(v) =>
              methods.setValue("variant", v, { shouldDirty: true })
            }
          />
          <div className="mt-4 flex flex-col gap-4">
            {variantRequiresPhone(variant) && <PhoneField required />}
            {variantRequiresShortCode(variant) && <BusinessShortCodeField />}
          </div>
        </section>

        {variantSupportsText(variant) && (
          <section>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              {t("sections.message")}
            </h2>
            <MessageField />
          </section>
        )}

        {variantSupportsUtm(variant) && (
          <section>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              {t("sections.tracking")}
            </h2>
            <UtmFieldset />
          </section>
        )}

        <div className="flex flex-wrap items-center gap-2 border-t border-[var(--color-border)] pt-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => reset(DEFAULT_VALUES)}
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            {t("reset")}
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onShare}>
            <Share2 className="size-4" aria-hidden="true" />
            {shared ? t("shared") : t("share")}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
