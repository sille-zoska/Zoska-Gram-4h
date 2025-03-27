// src/views/auth/SignInView.tsx

"use client";

// React and Next.js imports
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

// NextAuth imports
import { signIn } from "next-auth/react";

// Material-UI imports
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Divider,
  Paper,
  CircularProgress,
  Alert,
  Fade,
  Zoom,
} from "@mui/material";

// Material-UI Icons
import {
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  School as SchoolIcon,
  Google as GoogleIcon,
} from "@mui/icons-material";

// Custom components
import GoogleSignButton from "./GoogleSignButton";

// Types
interface FormData {
  email: string;
  password: string;
}

interface FormError {
  field: keyof FormData;
  message: string;
}

// Error message mapping
const ERROR_MESSAGES = {
  OAuthSignin: "Nastal problém s prihlásením cez Google. Skúste to znova.",
  OAuthCallback: "Nastal problém s prihlásením cez Google. Skúste to znova.",
  OAuthCreateAccount: "Nastal problém s prihlásením cez Google. Skúste to znova.",
  EmailSignin: "Nastal problém s odoslaním prihlasovacieho odkazu. Skúste to znova.",
  Callback: "Neplatný prihlasovací odkaz alebo vypršala jeho platnosť.",
  CredentialsSignin: "Nesprávny email alebo heslo.",
  default: "Prihlásenie zlyhalo. Skúste to znova.",
} as const;

/**
 * SignInView Component
 * 
 * Handles user authentication through Google OAuth and credentials.
 * Provides a clean and intuitive interface for users to sign in.
 */
const SignInView = () => {
  // Hooks
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  // Get error from URL params
  const error = searchParams?.get("error");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /**
   * Handle Google sign-in error
   */
  const handleGoogleSignInError = (err: Error) => {
    setFormError(ERROR_MESSAGES.OAuthSignin);
    setShowError(true);
    setLoading(false);
  };

  /**
   * Handle Google sign-in start
   */
  const handleGoogleSignInStart = () => {
    setLoading(true);
    setFormError(null);
    setShowError(false);
  };

  /**
   * Gets user-friendly error message based on error code
   */
  const getErrorMessage = (errorCode: string): string => {
    return ERROR_MESSAGES[errorCode as keyof typeof ERROR_MESSAGES] || ERROR_MESSAGES.default;
  };

  return (
    <Fade in timeout={500}>
      <Box 
        sx={{ 
          width: "100%",
          maxWidth: "480px",
          mx: "auto",
          px: 2,
          py: 4,
        }}
      >
        {/* Logo and Title Section */}
        <Zoom in timeout={500} style={{ transitionDelay: "100ms" }}>
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
                  fontSize: 60,
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
              Vitajte späť! Prihláste sa do svojho účtu
            </Typography>
          </Box>
        </Zoom>

        {/* Error Alert */}
        {(error || formError) && (
          <Fade in={showError || !!error} timeout={300}>
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                "& .MuiAlert-icon": {
                  fontSize: 28,
                },
              }}
              onClose={() => setShowError(false)}
            >
              {error ? getErrorMessage(error) : formError}
            </Alert>
          </Fade>
        )}

        {/* Sign In Form */}
        <Zoom in timeout={500} style={{ transitionDelay: "200ms" }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
                transform: "translateY(-2px)",
              },
            }}
          >
            {/* Google Sign In Button */}
            <GoogleSignButton 
              text="Prihlásiť sa cez Google"
              callbackUrl="/prispevky"
              disabled={loading}
              onSignInStart={handleGoogleSignInStart}
              onSignInError={handleGoogleSignInError}
            />

            {/* Divider */}
            <Divider sx={{ my: 3 }}>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{
                  px: 2,
                  fontWeight: 500,
                }}
              >
                alebo
              </Typography>
            </Divider>

            {/* Credentials form remains commented out */}
          </Paper>
        </Zoom>

        {/* Registration Link */}
        <Zoom in timeout={500} style={{ transitionDelay: "300ms" }}>
          <Box 
            sx={{ 
              mt: 4, 
              textAlign: "center",
              p: 3,
              borderRadius: 2,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              transition: "all 0.2s ease",
              "&:hover": {
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              },
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Nemáte účet?{" "}
              <Link href="/auth/registracia" passHref>
                <Typography
                  component="span"
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: "primary.main",
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      color: "primary.dark",
                      textDecoration: "underline",
                    },
                  }}
                >
                  Zaregistrujte sa
    </Typography>
              </Link>
    </Typography>
          </Box>
        </Zoom>
      </Box>
    </Fade>
  );
};

export default SignInView;