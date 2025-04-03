// src/app/(public)/layout.tsx


// Next.js imports
import { Metadata } from "next";

// React imports
import { Suspense } from "react";

// Component imports
import LoadingScreen from "@/components/LoadingScreen";
import AnimatedLayout from "@/components/AnimatedLayout";

// Style imports
import { containerStyles, contentBoxStyles } from "@/styles/layouts/publicLayout.styles";

// Types
interface PublicLayoutProps {
  children: React.ReactNode;
}

// Metadata for the public layout
export const metadata: Metadata = {
  title: "Public | ZoškaGram",
  description: "Verejná časť ZoškaGram - sociálna sieť pre študentov a učiteľov SPŠE Zochova.",
  robots: "index, follow",
};

/** Public Layout Component
 * @param {PublicLayoutProps} props - Component props
 * @returns {JSX.Element} Public layout with responsive container
 */
const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <AnimatedLayout
        containerStyles={containerStyles}
        contentBoxStyles={contentBoxStyles}
      >
        {children}
      </AnimatedLayout>
    </Suspense>
  );
};

export default PublicLayout;
