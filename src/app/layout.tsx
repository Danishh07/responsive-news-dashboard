// Root layout component for the Next.js application with global providers and theme support
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

/*
  Configure Geist font with CSS variables for use throughout the app
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/*
 SEO metadata configuration for the application
 */
export const metadata: Metadata = {
  title: "News Dashboard",
  description: "A responsive dashboard with news and payout features",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Inline script to prevent theme flash on page load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function setTheme() {
                  const theme = localStorage.getItem('theme');
                  const root = document.documentElement;
                  
                  // Remove existing theme classes
                  root.classList.remove('light', 'dark');
                  
                  let effectiveTheme = 'dark'; // Default theme
                  
                  if (theme === 'light') {
                    effectiveTheme = 'light';
                  } else if (theme === 'dark') {
                    effectiveTheme = 'dark';
                  } else if (theme === 'system') {
                    // Use system preference when theme is set to "system"
                    effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  
                  // Apply the theme class to prevent flash
                  root.classList.add(effectiveTheme);
                }
                
                // Set theme immediately on page load
                try {
                  setTheme();
                } catch (e) {
                  // Fallback to dark theme if localStorage is not available
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} antialiased`}>
        {/* Wrap all content with global providers (Redux, NextAuth, etc.) */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
