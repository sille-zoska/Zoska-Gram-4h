// src/app/(public)/auth/layout.tsx


// Next.js imports
import { Metadata } from "next";

// React imports
import { Suspense } from "react";

// MUI Component imports
import { Box, Container } from "@mui/material";

// Component imports
import LoadingScreen from "@/components/LoadingScreen";

// Types
interface AuthLayoutProps {
  children: React.ReactNode;
}

// Metadata for the auth layout
export const metadata: Metadata = {
  title: "Prihlásenie | ZoškaGram",
  description: "Prihláste sa do ZoškaGram - sociálnej siete pre študentov a učiteľov SPŠE Zochova.",
  robots: "noindex, nofollow",
};

/**
 * AuthLayout Component
 * 
 * Layout wrapper for authentication routes.
 * Features:
 * - Loading screen for suspense
 * - Linear gradient background effect
 * - Glass-effect container
 * - Centered content layout
 * - Responsive design
 * - Fade-in animation
 */
const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Box
        className="fade-in"
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.default",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "100%",
            background: "linear-gradient(135deg, rgba(255,56,92,0.1) 0%, rgba(29,161,242,0.1) 100%)",
            zIndex: 0,
          },
        }}
      >
        <Container
          maxWidth="sm"
          sx={{
            flex: 1,
            position: "relative",
            zIndex: 1,
            py: { xs: 4, sm: 6, md: 8 },
            px: { xs: 2, sm: 3 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            className="glass-effect"
            sx={{
              width: "100%",
              borderRadius: 3,
              p: { xs: 3, sm: 4, md: 5 },
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
  );
};

export default AuthLayout;
