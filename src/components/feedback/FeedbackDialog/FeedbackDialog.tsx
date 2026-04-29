'use client';

import { track } from '@vercel/analytics';
import { MessageSquareHeart, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { type FormEvent, type ReactElement, useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';

type Status = 'error' | 'idle' | 'submitting' | 'success';

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;
const FORMSPREE_URL = FORMSPREE_ID ? `https://formspree.io/f/${FORMSPREE_ID}` : null;

export function FeedbackDialog(): ReactElement {
  const t = useTranslations('feedback');
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent): void {
      if (e.key === 'Escape') setOpen(false);
    }
    if (open) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
      dialogRef.current?.focus();
    }

    return (): void => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const submit = useCallback(async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    if (formData.get('_hp')) return;

    if (!FORMSPREE_URL) {
      console.info(
        '[openzap] feedback submission (no endpoint configured):',
        Object.fromEntries(formData),
      );
      setStatus('success');
      track('feedback_submitted', { mode: 'mock' });
      form.reset();

      return;
    }

    setStatus('submitting');
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('success');
      track('feedback_submitted', { mode: 'formspree' });
      form.reset();
    } catch {
      setStatus('error');
    }
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="focus-ring hidden h-9 items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text-muted)] transition-colors hover:border-brand-500/40 hover:text-brand-600 sm:inline-flex"
      >
        <MessageSquareHeart aria-hidden="true" className="size-4" />
        {t('open')}
      </button>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t('open')}
        className="focus-ring inline-flex size-9 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] transition-colors hover:border-brand-500/40 hover:text-brand-600 sm:hidden"
      >
        <MessageSquareHeart aria-hidden="true" className="size-4" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
          <button
            type="button"
            aria-label="Close"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="absolute inset-0 cursor-default bg-black/50 backdrop-blur-sm"
          />
          <div
            ref={dialogRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-title"
            className="focus-ring relative w-full max-w-lg rounded-t-2xl bg-[var(--color-surface)] p-6 shadow-xl outline-none sm:rounded-2xl"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-3 top-3 inline-flex size-8 items-center justify-center rounded-full text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)]"
            >
              <X aria-hidden="true" className="size-4" />
            </button>

            <h2 id="feedback-title" className="text-lg font-semibold">
              {t('title')}
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">{t('description')}</p>

            <form onSubmit={submit} className="mt-4 space-y-3">
              <input type="text" name="_hp" tabIndex={-1} autoComplete="off" className="hidden" />

              <div>
                <Label htmlFor="fb-email">{t('emailLabel')}</Label>
                <Input id="fb-email" type="email" name="email" autoComplete="email" />
              </div>
              <div>
                <Label htmlFor="fb-message">{t('messageLabel')}</Label>
                <Textarea
                  id="fb-message"
                  name="message"
                  required
                  rows={4}
                  placeholder={t('messagePlaceholder')}
                />
              </div>

              {status === 'success' && (
                <p role="status" className="text-sm text-brand-600">
                  {t('success')}
                </p>
              )}
              {status === 'error' && (
                <p role="alert" className="text-sm text-red-500">
                  {t('error')}
                </p>
              )}

              <div className="flex items-center justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
                  {t('cancel')}
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={status === 'submitting'}
                >
                  {status === 'submitting' ? t('submitting') : t('submit')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
