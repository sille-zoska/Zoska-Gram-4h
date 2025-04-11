// src/app/(private)/layout.tsx

// Next.js imports
import { Metadata } from "next";

// React imports
import { Suspense } from "react";

// Component imports
import LoadingScreen from "@/components/LoadingScreen";
import AuthGuard from "@/components/AuthGuard";
import AnimatedLayout from "@/components/AnimatedLayout";

// Style imports
import { containerStyles, contentBoxStyles } from "@/styles/layouts/privateLayout.styles";

// Types
type PrivateLayoutProps = {
  children: React.ReactNode;
};

// Metadata for the layout
export const metadata: Metadata = {
  title: "ZoškaGram | Váš feed",
  description: "Prezerajte si príspevky od vašich spolužiakov a učiteľov, zdieľajte vlastné momenty a buďte v kontakte s komunitou SPŠE Zochova.",
  robots: "noindex, nofollow", // Private pages should not be indexed
};

/** Private Layout Component
 * @param {PrivateLayoutProps} props - Component props
 * @returns {JSX.Element} Private layout with responsive container
 */
const PrivateLayout = ({ children }: PrivateLayoutProps) => {
  return (
    <AuthGuard redirectPath="/auth/prihlasenie">
      <Suspense fallback={<LoadingScreen />}>
        <AnimatedLayout
          containerStyles={containerStyles}
          contentBoxStyles={contentBoxStyles}
        >
          {children}
        </AnimatedLayout>
      </Suspense>
    </AuthGuard>
  );
};

export default PrivateLayout;
