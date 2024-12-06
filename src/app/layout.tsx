// src/app/layout.tsx

import { Metadata } from "next";
import "./globals.css";

import ThemeProvider from "@/providers/ThemeProvider";
import AuthProvider from "../providers/AuthProvider";
import Navbar from "../components/NavBar";

export const metadata: Metadata = {
  title: "SnapZoška",
  description: "Created by students of SPŠE Zochova 9, Bratislava",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sk">
      <body>
        <AuthProvider>
          <ThemeProvider>
            <main >
              {children}
            </main>
            <Navbar />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
