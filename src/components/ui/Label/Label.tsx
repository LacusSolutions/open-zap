import type { LabelHTMLAttributes, ReactElement } from 'react';

import { cn } from '@/lib/utils';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor: string;
  required?: boolean;
}

export function Label({ className, children, required, ...props }: LabelProps): ReactElement {
  return (
    <label
      className={cn('block text-sm font-medium text-[var(--color-text)] mb-1.5', className)}
      {...props}
    >
      {children}
      {required && (
        <span aria-hidden="true" className="ml-0.5 text-red-500">
          *
        </span>
      )}
    </label>
  );
}
