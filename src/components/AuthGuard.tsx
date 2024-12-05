// src/components/AuthGuard.tsx

<<<<<<< HEAD
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

interface AuthGuardProps {
  children: React.ReactNode;
  redirectPath: string; // Make it required
}

export default function AuthGuard({ children, redirectPath }: AuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(redirectPath); // Redirect dynamically based on the prop
    }
  }, [status, router, redirectPath]);

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
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
}
=======
// NextAuth imports
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

// Relative imports
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

// Props interface for AuthGuard
interface AuthGuardProps {
  children: React.ReactNode;
  redirectPath: string;
}

// Server-side AuthGuard Component
const AuthGuard = async ({ children, redirectPath }: AuthGuardProps) => {
  const session = await getServerSession(authOptions);

  // Redirect unauthenticated users
  if (!session) {
    redirect(redirectPath);
  }

  return <>{children}</>;
};

export default AuthGuard;
>>>>>>> c12de16 (Initial commit with all project files)
