// src/app/layout.tsx

// Next.js imports
import { Metadata } from "next";

// React imports
import { Suspense } from "react";

// Provider imports
import ThemeProvider from "@/providers/ThemeProvider";
import AuthProvider from "@/providers/AuthProvider";

// Component imports
import Navbar from "@/components/NavBar";
import LoadingScreen from "@/components/LoadingScreen";

// Styles
import "./globals.css";

// Types
type RootLayoutProps = {
  children: React.ReactNode;
};

// Base viewport configuration for the entire app
export const viewport = {
  themeColor: "#FF385C",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

// Base metadata for the entire app
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://zoskagram.sk'),
  title: {
    template: '%s | ZoškaGram',
    default: 'ZoškaGram'
  },
  description: "Sociálna sieť pre študentov a učiteľov SPŠE Zochova 9, Bratislava. Zdieľajte momenty zo školského života, komunikujte s ostatnými a buďte súčasťou našej komunity.",
  keywords: ["SPŠE Zochova", "školská sociálna sieť", "študenti", "učitelia", "Bratislava", "škola", "komunita"],
  authors: [{ name: "SPŠE Zochova Students" }],
  creator: "SPŠE Zochova",
  publisher: "SPŠE Zochova",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "sk_SK",
    url: "https://zoskagram.sk",
    title: "ZoškaGram | Školská sociálna sieť",
    description: "Sociálna sieť pre študentov a učiteľov SPŠE Zochova 9, Bratislava",
    siteName: "ZoškaGram",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ZoškaGram - Školská sociálna sieť",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ZoškaGram | Školská sociálna sieť",
    description: "Sociálna sieť pre študentov a učiteľov SPŠE Zochova 9, Bratislava",
    images: ["/images/og-image.jpg"],
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/images/apple-touch-icon.png",
  },
};

/**
 * RootLayout Component
 * 
 * The root layout component that wraps the entire application.
 * Features:
 * - Theme provider for light/dark mode
 * - Authentication provider
 * - Global navigation bar
 * - Loading screen for suspense
 * - SEO optimization
 * - Responsive viewport settings
 * - PWA support with manifest and icons
 */
const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="sk" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <ThemeProvider>
            <div className="app-container">
              <Suspense fallback={<LoadingScreen />}>
                <main className="main-content">
                  {children}
                </main>
              </Suspense>
              <Navbar />
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
