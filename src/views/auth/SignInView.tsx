// src/views/auth/SignInView.tsx

"use client";

// React and Next.js imports
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

// Form and validation
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

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
  Email as EmailIcon,
  Lock as LockIcon,
  School as SchoolIcon,
} from "@mui/icons-material";

// Custom components
import GoogleSignButton from "./GoogleSignButton";

// Types and validation schema
interface FormData {
  email: string;
  password: string;
}

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Neplatný formát emailu")
    .required("Email je povinný"),
  password: yup
    .string()
    .required("Heslo je povinné"),
});

// Error message mapping
const ERROR_MESSAGES = {
  OAuthSignin: "Nastal problém s prihlásením cez Google. Skúste to znova.",
  OAuthCallback: "Nastal problém s prihlásením cez Google. Skúste to znova.",
  OAuthCreateAccount: "Nastal problém s prihlásením cez Google. Skúste to znova.",
  EmailSignin: "Nastal problém s odoslaním prihlasovacieho odkazu. Skúste to znova.",
  Callback: "Neplatný prihlasovací odkaz alebo vypršala jeho platnosť.",
  MISSING_CREDENTIALS: "Vyplňte email a heslo.",
  INVALID_CREDENTIALS: "Nesprávny email alebo heslo.",
  EMAIL_NOT_VERIFIED: "Váš email nie je overený. Skontrolujte svoj email alebo požiadajte o nový overovací kód.",
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
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  
  // State
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Get error from URL params
  const error = searchParams?.get("error");
  
  // Pre-fill email if provided in URL
  useEffect(() => {
    const emailParam = searchParams?.get("email");
    if (emailParam) {
      setValue("email", emailParam);
    }
  }, [searchParams, setValue]);

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

  /**
   * Toggle password visibility
   */
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  /**
   * Handle form submission
   */
  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setFormError(null);
    setShowError(false);
    
    try {
      const callbackUrl = searchParams?.get("callbackUrl") || "/prispevky";
      
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
        callbackUrl,
      });
      
      if (result?.error) {
        if (result.error === "EMAIL_NOT_VERIFIED") {
          router.push(`/auth/overenie?email=${encodeURIComponent(data.email)}`);
          return;
        }
        throw new Error(result.error);
      }
      
      // On success, redirect to callback URL or feed
      if (result?.url) {
        router.replace(result.url);
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setFormError(getErrorMessage((error as Error).message));
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {/* Logo and Title Section */}
      <Zoom in timeout={500} style={{ transitionDelay: "100ms" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 6,
          }}
        >
          <Typography
            variant="h3"
            className="gradient-text"
            sx={{
              mb: 2,
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
              fontSize: "1.1rem",
            }}
          >
            Vitajte späť! Prihláste sa do svojho účtu
          </Typography>
        </Box>
      </Zoom>

      {/* Error Alert */}
      {(error || formError) && showError && (
        <Fade in timeout={300}>
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            onClose={() => setShowError(false)}
          >
            {error ? getErrorMessage(error) : formError}
          </Alert>
        </Fade>
      )}

      {/* Sign In Form */}
      <Box>
        {/* Google Sign In Button */}
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mb: 2 }}
        >
          Pomocou Vášho účtu
        </Typography>
        <GoogleSignButton 
          text="Google"
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

        {/* Email/Password Sign In Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Email"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            <TextField
              fullWidth
              label="Heslo"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 600,
            }}
          >
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} color="inherit" />
                <span>Prihlasovanie...</span>
              </Box>
            ) : (
              "Prihlásiť"
            )}
          </Button>
        </form>
      </Box>

      {/* Registration Link */}
      <Box sx={{ mt: 4, textAlign: "center" }}>
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
                "&:hover": {
                  color: "primary.dark",
                  textDecoration: "underline",
                },
              }}
            >
              Registrovať
            </Typography>
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default SignInView;