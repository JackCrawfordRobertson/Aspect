import "../app/styles/globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/themeProvider";
import { AuthProvider } from "./Firebase/authContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// Viewport Configuration
export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FF5733",
};

// Metadata Configuration for Favicons and SEO
export const metadata = {
  title: "Aspect",
  description: "End the movie-night standoff. Pick, plan, and play – together.",
  icons: {
    icon: [
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable}`}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}