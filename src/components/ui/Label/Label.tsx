import type { LabelHTMLAttributes, ReactElement } from 'react';

import { cn } from '@/lib/utils';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor: string;
}

export function Label({ className, ...props }: LabelProps): ReactElement {
  return (
    // Reusable label primitive; association is enforced by required `htmlFor` prop.
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label
      className={cn('block text-sm font-medium text-[var(--color-text)] mb-1.5', className)}
      {...props}
    />
  );
}
