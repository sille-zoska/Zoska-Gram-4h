// src/app/(private)/layout.tsx

import { Metadata } from "next";

// Component imports
import AuthGuard from "@/components/AuthGuard";

// MUI imports
import Box from "@mui/material/Box";

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

// PrivateLayout Component
const PrivateLayout = ({ children }: PrivateLayoutProps) => (
  <AuthGuard redirectPath="/auth/prihlasenie">
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        backgroundColor: "background.default",
        px: 2,
      }}
    >
      {children}
    </Box>
  </AuthGuard>
);

export default PrivateLayout;
