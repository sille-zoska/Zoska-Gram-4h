// src/views/auth/SignUpView.tsx

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
  Button,
  Divider,
  Paper,
  CircularProgress,
  Alert,
  Fade,
  Zoom,
  FormControlLabel,
  Checkbox,
  FormHelperText,
} from "@mui/material";

// Material-UI Icons
import {
  School as SchoolIcon,
  Google as GoogleIcon,
} from "@mui/icons-material";

// Custom components
import GoogleSignButton from "./GoogleSignButton";

// Types
interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormError {
  field: keyof FormData;
  message: string;
}

// Error message mapping
const ERROR_MESSAGES = {
  OAuthSignin: "Nastal problém s registráciou cez Google. Skúste to znova.",
  OAuthCallback: "Nastal problém s registráciou cez Google. Skúste to znova.",
  OAuthCreateAccount: "Nastal problém s vytvorením účtu. Skúste to znova.",
  EmailSignin: "Nastal problém s odoslaním registračného odkazu. Skúste to znova.",
  Callback: "Neplatný registračný odkaz alebo vypršala jeho platnosť.",
  CredentialsSignin: "Registrácia zlyhala. Skúste to znova.",
  TermsNotAccepted: "Pre registráciu musíte súhlasiť s GDPR a podmienkami používania.",
  default: "Registrácia zlyhala. Skúste to znova.",
} as const;

/**
 * SignUpView Component
 * 
 * Handles user registration through Google OAuth.
 * Provides a clean and intuitive interface for users to create an account.
 */
const SignUpView = () => {
  // Hooks
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState(false);

  // Get error from URL params
  const error = searchParams?.get("error");

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
    if (!termsAccepted) {
      setTermsError(true);
      setFormError(ERROR_MESSAGES.TermsNotAccepted);
      setShowError(true);
      return false; // Prevent sign-in
    }
    
    setTermsError(false);
    setLoading(true);
    setFormError(null);
    setShowError(false);
    return true; // Allow sign-in
  };

  /**
   * Gets user-friendly error message based on error code
   */
  const getErrorMessage = (errorCode: string): string => {
    return ERROR_MESSAGES[errorCode as keyof typeof ERROR_MESSAGES] || ERROR_MESSAGES.default;
  };

  const handleTermsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTermsAccepted(event.target.checked);
    if (event.target.checked) {
      setTermsError(false);
      setShowError(false);
    }
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
              Vytvorte si nový účet a začnite zdieľať
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

        {/* Sign Up Form */}
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
            {/* GDPR and Terms Checkbox */}
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={termsAccepted} 
                    onChange={handleTermsChange} 
                    name="termsAccepted"
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2">
                    Súhlasím s{" "}
                    <Link href="/gdpr" passHref>
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: "primary.main",
                          textDecoration: "none",
                          "&:hover": {
                            textDecoration: "underline",
                          },
                        }}
                      >
                        GDPR
                      </Typography>
                    </Link>
                    {" "}a{" "}
                    <Link href="/podmienky" passHref>
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: "primary.main",
                          textDecoration: "none",
                          "&:hover": {
                            textDecoration: "underline",
                          },
                        }}
                      >
                        podmienkami používania
                      </Typography>
                    </Link>
                  </Typography>
                }
              />
              {termsError && (
                <FormHelperText error>
                  Pre registráciu musíte súhlasiť s GDPR a podmienkami používania
                </FormHelperText>
              )}
            </Box>

            {/* Google Sign Up Button */}
            <GoogleSignButton 
              text="Registrovať sa cez Google"
              callbackUrl="/prispevky"
              disabled={loading}
              onSignInStart={() => {
                const canProceed = handleGoogleSignInStart();
                return canProceed;
              }}
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

        {/* Sign In Link */}
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
              Už máte účet?{" "}
              <Link href="/auth/prihlasenie" passHref>
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
                  Prihláste sa
                </Typography>
              </Link>
            </Typography>
          </Box>
        </Zoom>
      </Box>
    </Fade>
  );
};

export default SignUpView;