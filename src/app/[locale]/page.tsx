import { getTranslations, setRequestLocale } from 'next-intl/server';
import { type ReactElement, Suspense } from 'react';

import { GeneratorShell } from '@/components/generator/GeneratorShell';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('hero');

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 pt-12 pb-6 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
                {t('title')}
              </span>
            </h1>
            <p className="mt-4 text-base text-[var(--color-text-muted)] sm:text-lg">
              {t('subtitle')}
            </p>
          </div>
        </section>
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
          <Suspense fallback={<GeneratorFallback />}>
            <GeneratorShell />
          </Suspense>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function GeneratorFallback(): ReactElement {
  return (
    <div className="grid animate-pulse gap-6 lg:grid-cols-[1.1fr_1fr] lg:gap-8">
      <div className="h-[30rem] rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]" />
      <div className="h-[30rem] rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]" />
    </div>
  );
}
