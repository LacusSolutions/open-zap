import { forwardRef, type InputHTMLAttributes, type ReactElement } from 'react';

import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, ...props },
  ref,
): ReactElement {
  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        'focus-ring w-full rounded-lg border bg-[var(--color-surface)] px-3.5 py-2 text-sm',
        'border-[var(--color-border)] text-[var(--color-text)]',
        'placeholder:text-[var(--color-text-muted)] transition-colors',
        'focus:border-brand-500',
        invalid && 'border-red-500 focus:border-red-500',
        className,
      )}
      {...props}
    />
  );
});
