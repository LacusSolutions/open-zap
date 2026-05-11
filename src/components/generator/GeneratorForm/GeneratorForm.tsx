'use client';

import { RotateCcw, Share2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { type ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';

import { BusinessShortCodeField } from '@/components/generator/BusinessShortCodeField';
import { MessageField } from '@/components/generator/MessageField';
import { PhoneField } from '@/components/generator/PhoneField';
import { UtmFieldset } from '@/components/generator/UtmFieldset';
import { VariantCombobox } from '@/components/generator/VariantCombobox';
import { Button } from '@/components/ui/Button';
import { decodeFormFromParams, encodeFormToParams } from '@/lib/formState';
import { type CountryCode, phoneToWhatsAppDigits } from '@/lib/phone';
import { DEFAULT_VALUES, type FormValues } from '@/lib/schema';
import {
  buildWhatsAppUrl,
  type LinkVariant,
  variantRequiresPhone,
  variantRequiresShortCode,
  variantSupportsText,
  variantSupportsUtm,
} from '@/lib/whatsapp';

interface GeneratorFormProps {
  onChange: (url: string, values: FormValues) => void;
}

const URL_DEBOUNCE_MS = 600;

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect((): (() => void) => {
    const id = window.setTimeout(() => setDebounced(value), delay);

    return () => window.clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

export function GeneratorForm({ onChange }: GeneratorFormProps): ReactElement {
  const t = useTranslations('form');
  const searchParams = useSearchParams();
  const [shared, setShared] = useState(false);

  const initialValues = useMemo<FormValues>(() => {
    const hydrated = decodeFormFromParams(searchParams);

    return { ...DEFAULT_VALUES, ...hydrated };
  }, [searchParams]);

  const methods = useForm<FormValues>({
    defaultValues: initialValues,
    mode: 'onChange',
  });

  const { control, reset, getValues } = methods;
  const values = useWatch({ control }) as FormValues;
  const variant = values.variant as LinkVariant;

  // Debounce the values driving URL computation so we don't rebuild + re-render
  // the QR canvas on every keystroke. UI conditionals still use `values`
  // directly, so showing/hiding fields stays instant.
  const debouncedValues = useDebouncedValue(values, URL_DEBOUNCE_MS);

  // Keep the latest onChange in a ref so a parent re-render that produces a
  // new callback identity does not re-fire the effect.
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const v = debouncedValues.variant as LinkVariant;
    const country = debouncedValues.country as CountryCode;
    const phoneDigits = variantRequiresPhone(v)
      ? phoneToWhatsAppDigits(debouncedValues.phone, country)
      : undefined;
    const url = buildWhatsAppUrl({
      variant: v,
      phone: phoneDigits,
      shortCode: variantRequiresShortCode(v) ? debouncedValues.shortCode : undefined,
      text: variantSupportsText(v) ? debouncedValues.text : undefined,
      utm: variantSupportsUtm(v) && debouncedValues.showUtm ? debouncedValues.utm : undefined,
    });
    onChangeRef.current(url, debouncedValues);
  }, [debouncedValues]);

  async function onShare(): Promise<void> {
    const params = encodeFormToParams(getValues());
    const url = `${window.location.origin}${window.location.pathname}${
      params.toString() ? `?${params.toString()}` : ''
    }`;
    await navigator.clipboard.writeText(url);
    setShared(true);
    window.setTimeout(() => setShared(false), 2000);
  }

  return (
    <FormProvider {...methods}>
      <form
        className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-x-8"
        onSubmit={(e) => e.preventDefault()}
      >
        <section>
          <h2
            id="destination-label"
            className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]"
          >
            {t('sections.destination')}
          </h2>
          <VariantCombobox
            value={variant}
            onChange={(v) => methods.setValue('variant', v, { shouldDirty: true })}
          />
          <div className="mt-4 flex flex-col gap-4">
            {variantRequiresPhone(variant) && <PhoneField required />}
            {variantRequiresShortCode(variant) && <BusinessShortCodeField />}
          </div>
        </section>

        {variantSupportsText(variant) && (
          <section>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              {t('sections.message')}
            </h2>
            <MessageField />
          </section>
        )}

        {variantSupportsUtm(variant) && (
          <section className="lg:col-span-2">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              {t('sections.tracking')}
            </h2>
            <UtmFieldset />
          </section>
        )}

        <div className="flex flex-wrap items-center gap-2 border-t border-[var(--color-border)] pt-4 lg:col-span-2">
          <Button type="button" variant="ghost" size="sm" onClick={() => reset(DEFAULT_VALUES)}>
            <RotateCcw className="size-4" aria-hidden="true" />
            {t('reset')}
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onShare}>
            <Share2 className="size-4" aria-hidden="true" />
            {shared ? t('shared') : t('share')}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
