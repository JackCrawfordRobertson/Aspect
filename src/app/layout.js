import "../app/styles/globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/themeProvider";
import { AuthProvider } from "./Firebase/authContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// PWA-related metadata and configs
export const metadata = {
  title: "Aspect",
  description: "End the movie-night standoff. Pick, plan, and play – together.",
  manifest: "/manifest.json",
  themeColor: "#FF5733",
  icons: {
    icon: [
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Aspect"
  }
};

export default function RootLayout({ children }) {
  // No "use client" here. This is a server component by default.
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body>
        {/* If AuthProvider depends on client logic, consider making AuthProvider a client component
            and import it here as a child. */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* AuthProvider might need to be a client component. If so, wrap its logic in a `use client` file. */}
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}