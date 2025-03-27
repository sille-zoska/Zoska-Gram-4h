// src/app/(private)/layout.tsx


// Next.js imports
import { Metadata } from "next";

// React imports
import { Suspense } from "react";

// MUI Component imports
import { Box, Container } from "@mui/material";

// Component imports
import LoadingScreen from "@/components/LoadingScreen";
import AuthGuard from "@/components/AuthGuard";

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

/**
 * PrivateLayout Component
 * 
 * Layout wrapper for authenticated routes.
 * Features:
 * - Authentication guard
 * - Loading screen for suspense
 * - Gradient background effect
 * - Glass-effect container
 * - Responsive design
 */
const PrivateLayout = ({ children }: PrivateLayoutProps) => {
  return (
    <AuthGuard redirectPath="/auth/prihlasenie">
      <Suspense fallback={<LoadingScreen />}>
        <Box
          className="fade-in"
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            bgcolor: "background.default",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "200px",
              background: "linear-gradient(45deg, #FF385C, #1DA1F2)",
              opacity: 0.1,
              zIndex: 0,
            },
          }}
        >
          <Container
            maxWidth="lg"
            sx={{
              flex: 1,
              position: "relative",
              zIndex: 1,
              py: { xs: 2, sm: 3, md: 4 },
              px: { xs: 2, sm: 3 },
            }}
          >
            <Box
              className="glass-effect"
              sx={{
                borderRadius: 3,
                p: { xs: 2, sm: 3, md: 4 },
                minHeight: "calc(100vh - 200px)",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
                },
              }}
            >
              {children}
            </Box>
          </Container>
        </Box>
      </Suspense>
    </AuthGuard>
  );
};

export default PrivateLayout;
