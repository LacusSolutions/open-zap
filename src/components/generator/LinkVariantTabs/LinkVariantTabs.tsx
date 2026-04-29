"use client";

import {
  CircleEllipsis,
  Code2,
  Globe2,
  Link as LinkIcon,
  MessageCircle,
  Phone,
  Share2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactElement, ReactNode } from "react";

import { cn } from "@/lib/utils";
import { LINK_VARIANTS, type LinkVariant } from "@/lib/whatsapp";

interface LinkVariantTabsProps {
  onChange: (variant: LinkVariant) => void;
  value: LinkVariant;
}

const ICONS: Record<LinkVariant, ReactNode> = {
  wa: <LinkIcon className="size-4" aria-hidden="true" />,
  api: <Code2 className="size-4" aria-hidden="true" />,
  deepLink: <MessageCircle className="size-4" aria-hidden="true" />,
  web: <Globe2 className="size-4" aria-hidden="true" />,
  call: <Phone className="size-4" aria-hidden="true" />,
  share: <Share2 className="size-4" aria-hidden="true" />,
  shortCode: <CircleEllipsis className="size-4" aria-hidden="true" />,
};

export function LinkVariantTabs({
  value,
  onChange,
}: LinkVariantTabsProps): ReactElement {
  const t = useTranslations("variants");

  return (
    <div
      role="tablist"
      aria-label="Link variant"
      className="flex flex-wrap gap-1.5"
    >
      {LINK_VARIANTS.map((variant) => {
        const active = value === variant;

        return (
          <button
            key={variant}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(variant)}
            title={t(`${variant}.description`)}
            className={cn(
              "focus-ring inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm",
              "border transition-colors",
              active
                ? "border-brand-500/40 bg-brand-500/10 text-brand-700 dark:text-brand-400"
                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]",
            )}
          >
            {ICONS[variant]}
            {t(`${variant}.label`)}
          </button>
        );
      })}
    </div>
  );
}
