// src/components/AuthGuard.tsx

"use client";

// React imports
import { ReactNode } from "react";

// Next.js imports
import { useRouter } from "next/navigation";

// NextAuth imports
import { useSession } from "next-auth/react";

// MUI imports
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

// TypeScript interfaces
interface AuthGuardProps {
  children: ReactNode;
  redirectPath: string;
}

// Authentication guard component that protects routes
const AuthGuard = ({ children, redirectPath }: AuthGuardProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Check for the from=signout parameter in the URL
  const isFromSignout = typeof window !== 'undefined' && 
    window.location.search.includes('from=signout');

  // Show loading spinner while checking authentication
  if (status === "loading") {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  // If user just signed out, don't redirect them again
  if (isFromSignout && !session) {
    // Remove the parameter and stay on the current page
    if (typeof window !== 'undefined') {
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
    return null; // Let the public page handle the rendering
  }

  // Redirect to specified path if not authenticated
  if (!session) {
    router.push(redirectPath);
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
