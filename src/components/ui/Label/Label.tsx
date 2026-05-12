import type { LabelHTMLAttributes, ReactElement } from 'react';

import { cn } from '@/lib/utils';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor: string;
  required?: boolean;
  /**
   * Announced by screen readers when `required` is true (e.g. localized
   * "required").
   */
  requiredAnnouncement?: string;
}

export function Label({
  className,
  children,
  required,
  requiredAnnouncement,
  ...props
}: LabelProps): ReactElement {
  const announced = requiredAnnouncement ?? 'required';

  return (
    <label
      className={cn('block text-sm font-medium text-[var(--color-text)] mb-1.5', className)}
      {...props}
    >
      {children}
      {required && (
        <>
          <span aria-hidden="true" className="ml-0.5 text-red-500">
            *
          </span>
          <span className="sr-only">{` (${announced})`}</span>
        </>
      )}
    </label>
  );
}
