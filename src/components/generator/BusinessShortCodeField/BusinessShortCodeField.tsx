'use client';

import { useTranslations } from 'next-intl';
import type { ReactElement } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import type { FormValues } from '@/lib/schema';
import { sanitizeShortCode } from '@/lib/whatsapp';

export function BusinessShortCodeField(): ReactElement {
  const t = useTranslations('form.shortCode');
  const tForm = useTranslations('form');
  const { control, watch, formState } = useFormContext<FormValues>();
  const value = watch('shortCode') ?? '';
  const showError = !!value && sanitizeShortCode(value) !== value && !!formState.submitCount;

  return (
    <div>
      <Label htmlFor="shortCode" required requiredAnnouncement={tForm('requiredMark')}>
        {t('label')}
      </Label>
      <Controller
        control={control}
        name="shortCode"
        render={({ field }) => (
          <Input
            id="shortCode"
            placeholder={t('placeholder')}
            invalid={showError}
            autoCapitalize="characters"
            autoComplete="off"
            aria-required
            {...field}
          />
        )}
      />
      <p
        className={`mt-1 text-xs ${showError ? 'text-red-500' : 'text-[var(--color-text-muted)]'}`}
      >
        {showError ? t('invalid') : t('help')}
      </p>
    </div>
  );
}
