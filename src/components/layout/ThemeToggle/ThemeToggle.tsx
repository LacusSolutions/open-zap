"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import {
  type ReactElement,
  type ReactNode,
  useMemo,
  useSyncExternalStore,
} from "react";

import { Combobox, type ComboboxItem } from "@/components/ui/Combobox";

const MODES = ["system", "light", "dark"] as const;
type Mode = (typeof MODES)[number];

const MODE_ICONS: Record<Mode, ReactNode> = {
  system: <Monitor className="size-4" aria-hidden="true" />,
  light: <Sun className="size-4" aria-hidden="true" />,
  dark: <Moon className="size-4" aria-hidden="true" />,
};

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

  const triggerIcon = mounted
    ? current === "system"
      ? MODE_ICONS.system
      : effective === "dark"
        ? MODE_ICONS.dark
        : MODE_ICONS.light
    : MODE_ICONS.system;

  const items = useMemo<ComboboxItem<Mode>[]>(
    () =>
      MODES.map((mode) => ({
        value: mode,
        label: t(`modes.${mode}`),
        icon: MODE_ICONS[mode],
      })),
    [t],
  );

  return (
    <Combobox<Mode>
      items={items}
      value={current}
      onValueChange={(next) => setTheme(next)}
      ariaLabel={t("toggleAriaLabel", { current: t(`modes.${current}`) })}
      triggerVariant="icon"
      triggerIcon={triggerIcon}
      align="end"
      showSearch={false}
    />
  );
}
