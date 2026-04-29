'use client';

import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes';
import type { ReactElement } from 'react';

export function ThemeProvider({ children, ...props }: ThemeProviderProps): ReactElement {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="openzap-theme"
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
