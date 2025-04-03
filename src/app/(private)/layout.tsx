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
            sx={containerStyles}
          >
            <Box
              className="glass-effect"
              sx={contentBoxStyles}
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
