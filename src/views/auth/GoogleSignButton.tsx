// src/views/auth/GoogleSignButton.tsx

"use client";

// React imports
import { useState } from "react";

// NextAuth imports
import { signIn } from "next-auth/react";

// MUI imports
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import GoogleIcon from "@mui/icons-material/Google";

// Types
interface GoogleSignButtonProps {
  text: string;
  callbackUrl?: string;
  disabled?: boolean;
  onSignInStart?: () => boolean | void;
  onSignInError?: (error: Error) => void;
}

/**
 * Enhanced Google Sign-In Button Component
 * 
 * Features:
 * - Loading state with spinner
 * - Improved UI with better hover effects
 * - Callback support for parent components
 * - Error handling
 * - Conditional sign-in prevention based on returned value from onSignInStart
 */
const GoogleSignButton = ({ 
  text, 
  callbackUrl = "/prispevky", 
  disabled = false,
  onSignInStart,
  onSignInError
}: GoogleSignButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    // Allow parent component to prevent sign-in
    if (onSignInStart) {
      const canProceed = onSignInStart();
      // If onSignInStart explicitly returns false, don't proceed
      if (canProceed === false) {
        return;
      }
    }

    setLoading(true);

    try {
      await signIn("google", {
        callbackUrl,
        redirect: true
      });
    } catch (error) {
      console.error("Google sign in error:", error);
      if (onSignInError) onSignInError(error as Error);
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outlined"
      fullWidth
      onClick={handleSignIn}
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={20} /> : <GoogleIcon />}
      sx={{
        py: 1.5,
        borderRadius: 50,
        mb: 3,
        borderWidth: 2,
        borderColor: "divider",
        color: "text.primary",
        bgcolor: "background.paper",
        transition: "all 0.3s ease",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "linear-gradient(45deg, rgba(66,133,244,0.05), rgba(219,68,55,0.05))",
          opacity: 0,
          transition: "opacity 0.3s ease",
        },
        "&:hover": {
          borderColor: "primary.main",
          bgcolor: "background.paper",
          transform: "translateY(-2px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          "&::before": {
            opacity: 1,
          },
        },
        "&:active": {
          transform: "translateY(0)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        },
        "&:disabled": {
          opacity: 0.7,
          bgcolor: "background.paper",
        },
      }}
    >
      {loading ? "Pripájam..." : text}
    </Button>
  );
};

export default GoogleSignButton;
