import { forwardRef, type ReactElement, type SelectHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, children, ...props },
  ref,
): ReactElement {
  return (
    <select
      ref={ref}
      className={cn(
        'focus-ring w-full rounded-lg border bg-[var(--color-surface)] px-3 py-2 text-sm',
        'border-[var(--color-border)] text-[var(--color-text)]',
        'transition-colors focus:border-brand-500 cursor-pointer',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
});
