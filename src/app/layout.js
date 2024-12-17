import "../app/styles/globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/themeProvider";
import { AuthProvider } from "./Firebase/authContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// Separate viewport configuration
export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FF5733", // Your primary colour
};

// Metadata for title and description
export const metadata = {
  title: "Aspect",
  description: "End the movie-night standoff. Pick, plan, and play – together.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning // Prevent hydration mismatch warnings
      className={`${inter.variable}`} // Ensures consistent font styles
    >
      <body>
        {/* Server-rendered layout */}
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