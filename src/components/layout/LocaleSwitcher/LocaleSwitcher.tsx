"use client";

import { Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { type ChangeEvent, type ReactElement, useTransition } from "react";

import { type Locale, LOCALE_LABELS, LOCALES } from "@/i18n/config";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function LocaleSwitcher(): ReactElement {
  const t = useTranslations("locale");
  const current = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  function onChange(event: ChangeEvent<HTMLSelectElement>): void {
    const nextLocale = event.target.value as Locale;

    startTransition(() => {
      router.replace(
        // @ts-expect-error - params type is too narrow for the generic route signature
        { pathname, params },
        { locale: nextLocale },
      );
    });
  }

  return (
    <label
      className={cn(
        "focus-ring inline-flex h-9 items-center gap-2 rounded-full border px-3",
        "border-[var(--color-border)] bg-[var(--color-surface)]",
        "text-sm text-[var(--color-text-muted)] transition-colors",
        "hover:border-brand-500/40 hover:text-brand-600",
        isPending && "opacity-60",
      )}
    >
      <Languages aria-hidden="true" className="size-4" />
      <span className="sr-only">{t("switchLabel")}</span>
      <select
        aria-label={t("switchLabel")}
        value={current}
        onChange={onChange}
        disabled={isPending}
        className="cursor-pointer bg-transparent pr-1 text-sm focus:outline-none"
      >
        {LOCALES.map((locale) => (
          <option
            key={locale}
            value={locale}
            className="text-[var(--color-text)]"
          >
            {LOCALE_LABELS[locale].native}
          </option>
        ))}
      </select>
    </label>
  );
}
