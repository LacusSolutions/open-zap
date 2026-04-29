import { defineRouting } from 'next-intl/routing';

export const LOCALES = ['en', 'pt-BR', 'es'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export function isSupportedLocale(candidate: unknown): candidate is Locale {
  return typeof candidate === 'string' && (LOCALES as readonly string[]).includes(candidate);
}

export const LOCALE_LABELS: Record<Locale, { english: string; flag: string; native: string }> = {
  en: { native: 'English', english: 'English', flag: 'gb' },
  'pt-BR': {
    native: 'Português (Brasil)',
    english: 'Portuguese (Brazil)',
    flag: 'br',
  },
  es: { native: 'Español', english: 'Spanish', flag: 'es' },
};

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'as-needed',
  localeDetection: true,
});
