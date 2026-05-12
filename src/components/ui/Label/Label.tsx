import type { LabelHTMLAttributes, ReactElement } from 'react';

import { cn } from '@/lib/utils';

export type LabelProps = {
  htmlFor: string;
} & (
  | { required: true; requiredAnnouncement: string }
  | { required?: false; requiredAnnouncement?: never }
) &
  LabelHTMLAttributes<HTMLLabelElement>;

type LabelImplProps = {
  htmlFor: string;
  required?: boolean;
  requiredAnnouncement?: string;
} & LabelHTMLAttributes<HTMLLabelElement>;

export function Label(props: LabelProps): ReactElement {
  const { className, children, htmlFor, required, requiredAnnouncement, ...rest } =
    props as LabelImplProps;
  const showRequired = required === true;
  const announced = showRequired ? requiredAnnouncement : undefined;

  if (process.env.NODE_ENV !== 'production' && showRequired && !announced) {
    console.warn('Label: `requiredAnnouncement` must be provided when `required` is true.');
  }

  return (
    <label
      className={cn('block text-sm font-medium text-[var(--color-text)] mb-1.5', className)}
      htmlFor={htmlFor}
      {...rest}
    >
      {children}
      {showRequired && announced && (
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
