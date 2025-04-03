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
import { keyframes } from "@mui/system";

// Animation keyframes
const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
`;

const spinAnimation = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

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
  const [pressed, setPressed] = useState(false);

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
      variant="contained"
      fullWidth
      onClick={handleSignIn}
      disabled={disabled || loading}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      startIcon={
        loading ? (
          <CircularProgress
            size={20}
            sx={{
              animation: `${spinAnimation} 1s linear infinite`,
              color: 'inherit'
            }}
          />
        ) : (
          <GoogleIcon
            sx={{
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              transition: 'transform 0.2s ease',
              transform: pressed ? 'scale(0.95)' : 'scale(1)',
            }}
          />
        )
      }
      sx={{
        py: { xs: 1.75, sm: 1.5 },     // Taller on mobile for better touch
        px: { xs: 3, sm: 4 },           // Wider padding on desktop
        borderRadius: 50,
        mb: 3,
        color: "white",
        background: "linear-gradient(45deg, #FF385C, #1DA1F2)",
        fontSize: { xs: '0.9rem', sm: '1rem' },
        fontWeight: 600,
        letterSpacing: '0.01em',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: "relative",
        overflow: "hidden",
        animation: loading ? 'none' : `${pulseAnimation} 2s infinite ease-in-out`,
        transform: pressed ? 'scale(0.98)' : 'scale(1)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',

        // Hover effects
        "&:hover": {
          background: "linear-gradient(45deg, #D32F2F, #1976D2)",
          transform: pressed ? 'scale(0.98)' : 'translateY(-2px)',
          boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
        },

        // Active state
        "&:active": {
          transform: "scale(0.98)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        },

        // Disabled state
        "&:disabled": {
          opacity: 0.7,
          background: "linear-gradient(45deg, #FF385C, #1DA1F2)",
          transform: 'none',
          animation: 'none',
        },

        // Touch device optimizations
        "@media (hover: none)": {
          "&:hover": {
            transform: 'none',
            boxShadow: "none",
          },
        },
      }}
    >
      {loading ? "Pripájam..." : text}
    </Button>
  );
};

export default GoogleSignButton;
