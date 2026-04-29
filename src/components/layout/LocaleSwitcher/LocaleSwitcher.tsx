'use client';

import { Languages } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { type ReactElement, useMemo, useTransition } from 'react';

import { Combobox, type ComboboxItem } from '@/components/ui/Combobox';
import { type Locale, LOCALE_LABELS, LOCALES } from '@/i18n/config';
import { usePathname, useRouter } from '@/i18n/navigation';

export function LocaleSwitcher(): ReactElement {
  const t = useTranslations('locale');
  const current = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  const items = useMemo<ComboboxItem<Locale>[]>(
    () =>
      LOCALES.map((locale) => ({
        value: locale,
        label: LOCALE_LABELS[locale].native,
        description: LOCALE_LABELS[locale].english,
        keywords: [LOCALE_LABELS[locale].english, LOCALE_LABELS[locale].native, locale],
      })),
    [],
  );

  function onChange(next: Locale): void {
    if (next === current) return;

    startTransition(() => {
      router.replace(
        // @ts-expect-error - params type is too narrow for the generic route signature
        { pathname, params },
        { locale: next },
      );
    });
  }

  return (
    <Combobox<Locale>
      items={items}
      value={current}
      onValueChange={onChange}
      ariaLabel={t('switchLabel')}
      triggerVariant="icon"
      triggerIcon={<Languages aria-hidden="true" className="size-4" />}
      align="end"
      showSearch={false}
      disabled={isPending}
    />
  );
}
