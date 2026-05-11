'use client';

import { track } from '@vercel/analytics';
import { type ReactElement, useCallback, useState } from 'react';

import { GeneratorForm } from '@/components/generator/GeneratorForm';
import { PreviewPanel } from '@/components/generator/PreviewPanel';
import type { FormValues } from '@/lib/schema';
import { type LinkVariant, variantRequiresPhone, variantRequiresShortCode } from '@/lib/whatsapp';

export function GeneratorShell(): ReactElement {
  const [url, setUrl] = useState<string>('https://wa.me');
  const [values, setValues] = useState<FormValues | null>(null);
  const [lastVariant, setLastVariant] = useState<string>('wa');

  const handleChange = useCallback(
    (next: string, nextValues: FormValues) => {
      setUrl(next);
      setValues(nextValues);
      if (nextValues.variant !== lastVariant) {
        track('variant_changed', { variant: nextValues.variant });
        setLastVariant(nextValues.variant);
      }
    },
    [lastVariant],
  );

  const variant = (values?.variant ?? 'wa') as LinkVariant;
  const phoneFilled = !!values?.phone?.trim();
  const shortCodeFilled = !!values?.shortCode?.trim();
  const showPanel =
    !!values &&
    (!variantRequiresPhone(variant) || phoneFilled) &&
    (!variantRequiresShortCode(variant) || shortCodeFilled);

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm sm:p-6">
        <GeneratorForm onChange={handleChange} />
      </div>
      {showPanel && (
        <PreviewPanel
          url={url}
          message={values?.text ?? ''}
          onCopy={() => track('copy_url', { variant: lastVariant })}
          onOpen={() => track('link_opened', { variant: lastVariant })}
          onQrDownload={(format) => track('qr_downloaded', { variant: lastVariant, format })}
        />
      )}
    </div>
  );
}
