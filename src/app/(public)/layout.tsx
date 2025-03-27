// src/app/(public)/layout.tsx


// Next.js imports
import { Metadata } from "next";

// React imports
import { Suspense } from "react";

// MUI Component imports
import { Box, Container } from "@mui/material";

// Component imports
import LoadingScreen from "@/components/LoadingScreen";

// Types
interface PublicLayoutProps {
  children: React.ReactNode;
}

// Metadata for the public layout
export const metadata: Metadata = {
  title: "Public | SnapZoška",
  description: "Verejná časť ZoškaGram - sociálna sieť pre študentov a učiteľov SPŠE Zochova.",
  robots: "index, follow",
};

/**
 * PublicLayout Component
 * 
 * Layout wrapper for public routes.
 * Features:
 * - Loading screen for suspense
 * - Radial gradient background effect
 * - Glass-effect container
 * - Responsive design
 * - Fade-in animation
 */
const PublicLayout = ({ children }: PublicLayoutProps) => {
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
            background: "radial-gradient(circle at top right, rgba(255,56,92,0.1), rgba(29,161,242,0.1))",
            zIndex: 0,
          },
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "100%",
            background: "radial-gradient(circle at bottom left, rgba(29,161,242,0.1), rgba(255,56,92,0.1))",
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
  );
};

export default PublicLayout;
