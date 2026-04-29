import type { ReactElement } from 'react';

import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps): ReactElement {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn('size-8', className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="oz-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#25D366" />
          <stop offset="1" stopColor="#075E54" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#oz-grad)" />
      <path
        d="M11 19.5 14.2 23l7-10"
        stroke="#FFFFFF"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.95"
      />
      <path
        d="M22 10v10a2 2 0 0 1-2 2H14l-3 3v-3h-.5A1.5 1.5 0 0 1 9 20.5V11a2 2 0 0 1 2-2h9"
        stroke="#FFFFFF"
        strokeWidth="1.2"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
      />
    </svg>
  );
}
