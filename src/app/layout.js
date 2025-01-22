// src/app/layout.js
import "../app/styles/globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/themeProvider";
import { Suspense } from "react";
import { AuthProvider } from "./Firebase/authContext"; // Import the AuthProvider

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", 
  display: "swap",          
});

// Server-side metadata function
export async function generateMetadata() {
  return {
    title: "Aspect",
    description: "End the movie-night standoff. Pick, plan, and play – together.",
    manifest: "/manifest.json",
    icons: {
      icon: [
        { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
        { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "Aspect",
    },
  };
}

// Next.js 15+ viewport export
export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FF5733",
};

// Spinner Component
function Spinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
    </div>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <ThemeProvider>
        <AuthProvider> 
          <Suspense fallback={<Spinner />}>{children}</Suspense>
        </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}