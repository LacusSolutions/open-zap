"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { type ReactElement, useSyncExternalStore } from "react";

import { cn } from "@/lib/utils";

const ORDER = ["system", "light", "dark"] as const;
type Mode = (typeof ORDER)[number];

function nextTheme(current: string | undefined): Mode {
  const idx = Math.max(0, ORDER.indexOf((current as Mode) ?? "system"));

  return ORDER[(idx + 1) % ORDER.length];
}

function subscribe(): () => void {
  return () => {
    /* theme toggle does not need to subscribe to external changes */
  };
}

function getClientSnapshot(): boolean {
  return true;
}

function getServerSnapshot(): boolean {
  return false;
}

function useHasMounted(): boolean {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}

export function ThemeToggle(): ReactElement {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useHasMounted();
  const t = useTranslations("theme");

  const current = (theme as Mode | undefined) ?? "system";
  const effective = resolvedTheme ?? "light";
  const label = t(`modes.${current}`);
  const Icon = mounted
    ? current === "system"
      ? Monitor
      : effective === "dark"
        ? Moon
        : Sun
    : Monitor;

  return (
    <button
      type="button"
      aria-label={t("toggleAriaLabel", { current: label })}
      title={t("toggleTitle", { current: label })}
      onClick={() => setTheme(nextTheme(current))}
      className={cn(
        "focus-ring inline-flex size-9 items-center justify-center rounded-full",
        "border border-[var(--color-border)] bg-[var(--color-surface)]",
        "text-[var(--color-text-muted)] transition-colors",
        "hover:text-brand-600 hover:border-brand-500/40",
      )}
    >
      <Icon aria-hidden="true" className="size-4" />
    </button>
  );
}
