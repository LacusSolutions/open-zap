'use client';

import { ChevronDown, Tags } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { ReactElement } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import type { FormValues } from '@/lib/schema';
import { cn } from '@/lib/utils';

type UtmKey = 'campaign' | 'content' | 'medium' | 'source' | 'term';
const FIELDS: { key: UtmKey; placeholderKey?: string }[] = [
  { key: 'source', placeholderKey: 'sourcePlaceholder' },
  { key: 'medium', placeholderKey: 'mediumPlaceholder' },
  { key: 'campaign', placeholderKey: 'campaignPlaceholder' },
  { key: 'content' },
  { key: 'term' },
];

export function UtmFieldset(): ReactElement {
  const t = useTranslations('form.utm');
  const { control, watch, setValue } = useFormContext<FormValues>();
  const showUtm = watch('showUtm') ?? false;

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      <button
        type="button"
        onClick={() => setValue('showUtm', !showUtm, { shouldDirty: true })}
        className={cn(
          'focus-ring flex w-full items-center justify-between gap-2 rounded-xl px-4 py-3',
          'text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-surface-muted)]',
        )}
        aria-expanded={showUtm}
      >
        <span className="inline-flex items-center gap-2">
          <Tags aria-hidden="true" className="size-4 text-brand-500" />
          {t('toggle')}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={cn('size-4 transition-transform', showUtm && 'rotate-180')}
        />
      </button>
      {showUtm && (
        <div className="grid gap-3 p-4 pt-0 sm:grid-cols-2">
          {FIELDS.map(({ key, placeholderKey }) => (
            <div key={key}>
              <Label htmlFor={`utm-${key}`}>{t(key)}</Label>
              <Controller
                control={control}
                name={`utm.${key}` as const}
                render={({ field }) => (
                  <Input
                    id={`utm-${key}`}
                    autoComplete="off"
                    placeholder={placeholderKey ? t(placeholderKey) : undefined}
                    {...field}
                  />
                )}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
