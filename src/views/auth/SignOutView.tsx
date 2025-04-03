"use client";

// React and Next.js imports
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// NextAuth imports
import { signOut } from "next-auth/react";

// Material-UI imports
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Fade,
  Zoom,
  Dialog,
} from "@mui/material";

// Material-UI Icons
import {
  School as SchoolIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";

// Types
interface SignOutError {
  message: string;
}

interface SignOutViewProps {
  open: boolean;
  onClose: () => void;
}

/**
 * SignOutView Component
 * 
 * Handles user sign-out process with a confirmation screen.
 * Provides a clean and intuitive interface for users to sign out.
 */
const SignOutView = ({ open, onClose }: SignOutViewProps) => {
  // Hooks
  const router = useRouter();
  
  // State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  /**
   * Handles the sign-out process
   * Redirects to home page on success
   */
  const handleSignOut = async () => {
    setLoading(true);
    setError(null);
    setShowError(false);

    try {
      await signOut({ 
        redirect: false,
        callbackUrl: "/"
      });
      onClose();
      router.push("/");
    } catch (err) {
      console.error("Sign out error:", err);
      setError("Odhlásenie zlyhalo. Skúste to znova.");
      setShowError(true);
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
        },
      }}
    >
      <Box 
        sx={{ 
          width: "100%",
          px: 2,
          py: 4,
        }}
      >
        {/* Logo and Title Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Box
            sx={{
              position: "relative",
              mb: 2,
            }}
          >
            <SchoolIcon
              sx={{
                fontSize: "60px",
                color: "primary.main",
                filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))",
                animation: "float 3s ease-in-out infinite",
              }}
              aria-label="ZoškaGram Logo"
            />
            <Box
              sx={{
                position: "absolute",
                top: -8,
                right: -8,
                width: 24,
                height: 24,
                borderRadius: "50%",
                bgcolor: "secondary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "white",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                }}
              >
                BETA
              </Typography>
            </Box>
          </Box>
          <Typography
            variant="h4"
            className="gradient-text"
            sx={{
              mb: 1,
              textAlign: "center",
              fontWeight: 700,
            }}
          >
            ZoškaGram
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            align="center"
            sx={{
              maxWidth: "80%",
            }}
          >
            Ste si istí, že sa chcete odhlásiť?
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            onClose={() => setShowError(false)}
          >
            {error}
          </Alert>
        )}

        {/* Sign Out Actions */}
        <Box>
          {/* Sign Out Button */}
          <Button
            fullWidth
            variant="outlined"
            color="error"
            onClick={handleSignOut}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <LogoutIcon />}
            sx={{
              py: 1.5,
              borderRadius: 50,
              mb: 3,
              borderWidth: 2,
              borderColor: "error.main",
              color: "error.main",
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: "error.dark",
                bgcolor: "error.light",
                color: "error.dark",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(211, 47, 47, 0.1)",
              },
              "&:disabled": {
                opacity: 0.7,
              },
            }}
          >
            Odhlásiť sa
          </Button>

          {/* Cancel Button */}
          <Button
            fullWidth
            variant="outlined"
            onClick={onClose}
            disabled={loading}
            sx={{
              py: 1.5,
              borderRadius: 50,
              borderWidth: 2,
              borderColor: "divider",
              color: "text.primary",
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: "primary.main",
                bgcolor: "background.paper",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              },
              "&:disabled": {
                opacity: 0.7,
              },
            }}
          >
            Zrušiť
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default SignOutView;