import { forwardRef, type ReactElement, type TextareaHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, invalid, ...props },
  ref,
): ReactElement {
  return (
    <textarea
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        'focus-ring w-full rounded-lg border bg-[var(--color-surface)] px-3.5 py-2 text-sm',
        'border-[var(--color-border)] text-[var(--color-text)]',
        'placeholder:text-[var(--color-text-muted)] transition-colors',
        'focus:border-brand-500 resize-y min-h-[7rem]',
        invalid && 'border-red-500 focus:border-red-500',
        className,
      )}
      {...props}
    />
  );
});
