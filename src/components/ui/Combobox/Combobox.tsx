"use client";

import * as Popover from "@radix-ui/react-popover";
import { Command } from "cmdk";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { type ReactElement, type ReactNode, useId, useState } from "react";

import { cn } from "@/lib/utils";

export interface ComboboxItem<T extends string = string> {
  description?: string;
  icon?: ReactNode;
  keywords?: string[];
  label: string;
  value: T;
}

export interface ComboboxProps<T extends string = string> {
  ariaLabel?: string;
  className?: string;
  contentClassName?: string;
  disabled?: boolean;
  emptyLabel?: string;
  id?: string;
  items: ComboboxItem<T>[];
  onValueChange: (value: T) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  showSearch?: boolean;
  value: T;
}

export function Combobox<T extends string = string>({
  items,
  value,
  onValueChange,
  id,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyLabel = "No results.",
  ariaLabel,
  showSearch = true,
  disabled,
  className,
  contentClassName,
}: ComboboxProps<T>): ReactElement {
  const [open, setOpen] = useState(false);
  const listboxId = useId();
  const selected = items.find((item) => item.value === value);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-haspopup="listbox"
          aria-label={ariaLabel}
          disabled={disabled}
          className={cn(
            "focus-ring group flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left",
            "bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text)]",
            "transition-colors hover:border-brand-500/40",
            "data-[state=open]:border-brand-500/60 data-[state=open]:ring-2 data-[state=open]:ring-brand-500/10",
            "disabled:cursor-not-allowed disabled:opacity-60",
            className,
          )}
        >
          {selected?.icon ? (
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-700 dark:text-brand-400">
              {selected.icon}
            </span>
          ) : null}
          <span className="flex min-w-0 flex-1 flex-col leading-tight">
            <span className="truncate text-sm font-medium">
              {selected?.label ?? placeholder}
            </span>
            {selected?.description ? (
              <span className="mt-0.5 truncate text-xs text-[var(--color-text-muted)]">
                {selected.description}
              </span>
            ) : null}
          </span>
          <ChevronsUpDown
            aria-hidden="true"
            className="size-4 shrink-0 text-[var(--color-text-muted)] transition-transform group-data-[state=open]:rotate-180"
          />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={8}
          collisionPadding={16}
          className={cn(
            "popover-content z-50 w-[var(--radix-popover-trigger-width)] min-w-[16rem] origin-[var(--radix-popover-content-transform-origin)] overflow-hidden rounded-xl border shadow-xl",
            "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)]",
            contentClassName,
          )}
        >
          <Command
            loop
            filter={(itemValue, search, keywords) => {
              const haystack = [itemValue, ...(keywords ?? [])]
                .join(" ")
                .toLowerCase();
              const needle = search.trim().toLowerCase();
              if (needle.length === 0) return 1;
              return haystack.includes(needle) ? 1 : 0;
            }}
          >
            {showSearch ? (
              <div className="flex items-center gap-2 border-b border-[var(--color-border)] px-3">
                <Search
                  aria-hidden="true"
                  className="size-4 text-[var(--color-text-muted)]"
                />
                <Command.Input
                  placeholder={searchPlaceholder}
                  className="flex-1 bg-transparent py-2.5 text-sm outline-none placeholder:text-[var(--color-text-muted)]"
                />
              </div>
            ) : null}
            <Command.List
              id={listboxId}
              className="max-h-[20rem] overflow-y-auto p-1"
            >
              <Command.Empty className="px-3 py-6 text-center text-sm text-[var(--color-text-muted)]">
                {emptyLabel}
              </Command.Empty>
              {items.map((item) => {
                const isSelected = item.value === value;

                return (
                  <Command.Item
                    key={item.value}
                    value={item.value}
                    keywords={[
                      item.label,
                      item.description ?? "",
                      ...(item.keywords ?? []),
                    ]}
                    onSelect={() => {
                      onValueChange(item.value);
                      setOpen(false);
                    }}
                    className={cn(
                      "group/item flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-sm",
                      "data-[selected=true]:bg-[var(--color-surface-muted)]",
                      "aria-selected:bg-[var(--color-surface-muted)]",
                    )}
                  >
                    {item.icon ? (
                      <span
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                          isSelected
                            ? "bg-brand-500/15 text-brand-700 dark:text-brand-400"
                            : "bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] group-data-[selected=true]/item:text-[var(--color-text)]",
                        )}
                      >
                        {item.icon}
                      </span>
                    ) : null}
                    <span className="flex min-w-0 flex-1 flex-col leading-tight">
                      <span
                        className={cn(
                          "truncate font-medium",
                          isSelected
                            ? "text-brand-700 dark:text-brand-400"
                            : "text-[var(--color-text)]",
                        )}
                      >
                        {item.label}
                      </span>
                      {item.description ? (
                        <span className="mt-0.5 truncate text-xs text-[var(--color-text-muted)]">
                          {item.description}
                        </span>
                      ) : null}
                    </span>
                    {isSelected ? (
                      <Check
                        aria-hidden="true"
                        className="size-4 shrink-0 text-brand-600 dark:text-brand-400"
                      />
                    ) : null}
                  </Command.Item>
                );
              })}
            </Command.List>
          </Command>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
