// src/components/AuthGuard.tsx


"use client";

// NextAuth imports
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// MUI imports
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

// Props interface for AuthGuard
interface AuthGuardProps {
  children: React.ReactNode;
  redirectPath: string;
}

// Client-side AuthGuard Component
const AuthGuard = ({ children, redirectPath }: AuthGuardProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();

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

  if (!session) {
    router.push(redirectPath);
    return null; // Prevent rendering children during redirect
  }

  return <>{children}</>;
};

export default AuthGuard;
