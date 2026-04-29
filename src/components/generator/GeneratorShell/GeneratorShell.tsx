'use client';

import { track } from '@vercel/analytics';
import { type ReactElement, useCallback, useState } from 'react';

import { GeneratorForm } from '@/components/generator/GeneratorForm';
import { PreviewPanel } from '@/components/generator/PreviewPanel';
import type { FormValues } from '@/lib/schema';

export function GeneratorShell(): ReactElement {
  const [url, setUrl] = useState<string>('https://wa.me');
  const [message, setMessage] = useState<string>('');
  const [lastVariant, setLastVariant] = useState<string>('wa');

  const handleChange = useCallback(
    (next: string, values: FormValues) => {
      setUrl(next);
      setMessage(values.text ?? '');
      if (values.variant !== lastVariant) {
        track('variant_changed', { variant: values.variant });
        setLastVariant(values.variant);
      }
    },
    [lastVariant],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:gap-8">
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm sm:p-6">
        <GeneratorForm onChange={handleChange} />
      </div>
      <PreviewPanel
        url={url}
        message={message}
        onCopy={() => track('copy_url', { variant: lastVariant })}
        onOpen={() => track('link_opened', { variant: lastVariant })}
        onQrDownload={(format) => track('qr_downloaded', { variant: lastVariant, format })}
      />
    </div>
  );
}
