import "../app/styles/globals.css";
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: "Aspect",
  description: "End the movie-night standoff. Pick, plan, and play – together.",
  themeColor: '#FF5733', // This sets the mobile browser’s top bar colour
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}