"use client";

import React, { useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }) {
  const [mounted, setMounted] = useState(false);

  // Delay rendering until after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Prevent mismatches during hydration
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light" // Ensure light theme is applied initially
      enableSystem={true} // Allow system-based switching
      disableTransitionOnChange // Avoid transitions during theme changes
    >
      {children}
    </NextThemesProvider>
  );
}