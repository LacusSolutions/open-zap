import { useTranslations } from 'next-intl';
import type { ReactElement } from 'react';

const GITHUB_URL = 'https://github.com/juliolmuller/openzap';

export function Footer(): ReactElement {
  const t = useTranslations('footer');

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-[var(--color-text-muted)] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>
          © {new Date().getFullYear()} Lacus Solutions · {t('madeBy')}{' '}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="font-medium text-brand-600 hover:underline"
          >
            {t('github')}
          </a>
          .
        </p>
        <p className="max-w-xl sm:text-right">{t('trademark')}</p>
      </div>
    </footer>
  );
}
