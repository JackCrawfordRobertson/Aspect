"use client";

import React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children, ...rest }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" {...rest}>
      {children}
    </NextThemesProvider>
  );
}