'use client';

import { Check, Copy } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { type ReactElement, useCallback, useState } from 'react';

import { Button, type ButtonProps } from '@/components/ui/Button';

interface CopyButtonProps extends Omit<ButtonProps, 'children' | 'onClick'> {
  onCopy?: () => void;
  text: string;
}

export function CopyButton({ text, onCopy, ...props }: CopyButtonProps): ReactElement {
  const t = useTranslations('preview.url');
  const [copied, setCopied] = useState(false);

  const handle = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onCopy?.();
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* no-op */
    }
  }, [text, onCopy]);

  return (
    <Button {...props} onClick={handle}>
      {copied ? (
        <>
          <Check className="size-4" aria-hidden="true" />
          {t('copied')}
        </>
      ) : (
        <>
          <Copy className="size-4" aria-hidden="true" />
          {t('copy')}
        </>
      )}
    </Button>
  );
}
