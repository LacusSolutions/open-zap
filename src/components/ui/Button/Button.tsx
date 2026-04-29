import { type ButtonHTMLAttributes, forwardRef, type ReactElement } from 'react';

import { cn } from '@/lib/utils';

export type ButtonVariant = 'ghost' | 'outline' | 'primary' | 'secondary';
export type ButtonSize = 'icon' | 'lg' | 'md' | 'sm';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  variant?: ButtonVariant;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-500 text-white shadow-sm hover:bg-brand-600 active:bg-brand-700 disabled:bg-brand-500/60',
  secondary:
    'bg-[var(--color-surface-muted)] text-[var(--color-text)] hover:bg-[var(--color-border)]',
  ghost:
    'bg-transparent text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)]',
  outline:
    'border border-[var(--color-border)] bg-transparent text-[var(--color-text)] hover:border-brand-500/40 hover:text-brand-600',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm rounded-md gap-1.5',
  md: 'h-10 px-4 text-sm rounded-lg gap-2',
  lg: 'h-12 px-5 text-base rounded-xl gap-2',
  icon: 'size-9 rounded-full',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', className, type = 'button', ...props },
  ref,
): ReactElement {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'focus-ring inline-flex items-center justify-center font-medium transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
});
