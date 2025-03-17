// src/app/layout.tsx

import { Metadata } from "next";
import "./globals.css";

// Provider imports
import ThemeProvider from "@/providers/ThemeProvider";
import AuthProvider from "../providers/AuthProvider";

// Component imports
import Navbar from "../components/NavBar";

// Base viewport configuration for the entire app
export const viewport = {
  themeColor: "#1976d2",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

// Base metadata for the entire app
export const metadata: Metadata = {
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
  },
};

type RootLayoutProps = {
  children: React.ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="sk">
      <body>
        <AuthProvider>
          <ThemeProvider>
            <main>
              {children}
            </main>
            <Navbar />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
