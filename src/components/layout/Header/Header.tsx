import { useTranslations } from "next-intl";
import type { ReactElement } from "react";

import { FeedbackDialog } from "@/components/feedback/FeedbackDialog";
import { GitHubIcon } from "@/components/layout/icons/GitHubIcon";
import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import { Logo } from "@/components/layout/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Link } from "@/i18n/navigation";

const GITHUB_URL = "https://github.com/juliolmuller/openzap";

export function Header(): ReactElement {
  const t = useTranslations();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[color-mix(in_oklab,var(--color-bg)_86%,transparent)] backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="focus-ring inline-flex items-center gap-2 rounded-full px-1 py-0.5"
        >
          <Logo />
          <div className="flex flex-col leading-none">
            <span className="text-lg font-bold tracking-tight">
              {t("app.name")}
            </span>
            <span className="text-[11px] text-[var(--color-text-muted)]">
              {t("app.tagline")}
            </span>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <FeedbackDialog />
          <LocaleSwitcher />
          <ThemeToggle />
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={t("header.github")}
            title={t("header.github")}
            className="focus-ring inline-flex size-9 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] transition-colors hover:border-brand-500/40 hover:text-brand-600"
          >
            <GitHubIcon aria-hidden="true" className="size-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
