// src/components/AuthGuard.tsx

"use client";

// React imports
import { ReactNode, useEffect } from "react";

// Next.js imports
import { useRouter, usePathname } from "next/navigation";

// NextAuth imports
import { useSession } from "next-auth/react";

// MUI Component imports
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";

// MUI Icon imports
import LockIcon from "@mui/icons-material/Lock";

// Types
interface AuthGuardProps {
  children: ReactNode;
  redirectPath: string;
}

/**
 * AuthGuard Component
 * 
 * Protects routes by requiring authentication.
 * Features:
 * - Smooth loading transitions
 * - Redirect handling
 * - Session persistence
 * - Post-login redirect
 * - Animated loading state
 */
const AuthGuard = ({ children, redirectPath }: AuthGuardProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      // Store the attempted URL for post-login redirect
      sessionStorage.setItem('redirectAfterLogin', pathname);
      router.push(redirectPath);
    } else if (session && pathname === '/auth/prihlasenie') {
      // If logged in and trying to access login page, redirect to feed
      router.push('/prispevky');
    }
  }, [session, status, router, pathname, redirectPath]);

  if (status === 'loading') {
    return (
      <Box
        className="fade-in"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          gap: 2,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            p: 4,
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[4],
            animation: "float 3s ease-in-out infinite",
          }}
        >
          <LockIcon
            sx={{
              fontSize: 48,
              color: theme.palette.primary.main,
              animation: "spin 10s linear infinite",
            }}
          />
          <CircularProgress
            color="secondary"
            size={24}
            thickness={4}
            sx={{
              animation: "pulse 2s ease-in-out infinite",
            }}
          />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              opacity: 0.8,
              animation: "fade 2s ease-in-out infinite",
            }}
          >
            Overujem prihlásenie...
          </Typography>
        </Box>
      </Box>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
