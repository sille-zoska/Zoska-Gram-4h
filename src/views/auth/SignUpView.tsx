// src/views/auth/SignUpView.tsx

"use client";

// React and Next.js imports
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

// Form and validation
import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

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
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";

// Material-UI Icons
import {
  School as SchoolIcon,
  Google as GoogleIcon,
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
} from "@mui/icons-material";

// Custom components
import GoogleSignButton from "./GoogleSignButton";

// Types and validation schema
export type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
}

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Neplatný formát emailu")
    .required("Email je povinný"),
  password: yup
    .string()
    .min(8, "Heslo musí mať aspoň 8 znakov")
    .required("Heslo je povinné"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], "Heslá sa nezhodujú")
    .required("Potvrďte heslo"),
  termsAccepted: yup
    .boolean()
    .required("Musíte súhlasiť s podmienkami")
    .oneOf([true], "Pre registráciu musíte súhlasiť s GDPR a podmienkami používania"),
}) satisfies yup.ObjectSchema<FormData>;

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

// Add proper error type
interface ApiError {
  error: string;
}

/**
 * SignUpView Component
 * 
 * Handles user registration through Google OAuth or email/password.
 * Provides a clean and intuitive interface for users to create an account.
 */
const SignUpView = () => {
  // Hooks
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
  });
  
  // State
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Get error from URL params
  const error = searchParams?.get("error");

  // Watch termsAccepted value for Google Sign In validation
  const termsAccepted = watch("termsAccepted");

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
      setFormError(ERROR_MESSAGES.TermsNotAccepted);
      setShowError(true);
      return false;
    }
    
    setLoading(true);
    setFormError(null);
    setShowError(false);
    return true;
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
   * Toggle confirm password visibility
   */
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  /**
   * Handle form submission
   */
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    setFormError(null);
    setShowError(false);
    
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Registration failed");
      }

      // Redirect to verification page
      router.push(`/auth/overenie?email=${encodeURIComponent(data.email)}`);
    } catch (error) {
      console.error("Registration error:", error);
      
      // Type guard to check if error is Error instance
      const isError = (err: unknown): err is Error => {
        return err instanceof Error;
      };

      setFormError(getErrorMessage(isError(error) ? error.message : "Registration failed"));
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
            Vytvorte si nový účet a pripojte sa k našej komunite
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

      {/* Sign Up Form */}
      <Box>
        {/* Google Sign Up Button */}
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

        {/* Email/Password Sign Up Form */}
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
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            <TextField
              fullWidth
              label="Potvrdiť heslo"
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword")}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={toggleConfirmPasswordVisibility}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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

          {/* Terms and Conditions Checkbox */}
          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  {...register("termsAccepted")}
                  color="primary"
                  disabled={loading}
                />
              }
              label={
                <Typography variant="body2">
                  Súhlasím s{" "}
                  <Link href="/gdpr" target="_blank" passHref>
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{
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
                  <Link href="/podmienky" target="_blank" passHref>
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{
                        color: "primary.main",
                        textDecoration: "none",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      podmienkami
                    </Typography>
                  </Link>
                </Typography>
              }
            />
            {errors.termsAccepted && (
              <FormHelperText error>
                {errors.termsAccepted.message}
              </FormHelperText>
            )}
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
                <span>Registrácia...</span>
              </Box>
            ) : (
              "Registrovať"
            )}
          </Button>
        </form>
      </Box>

      {/* Sign In Link */}
      <Box sx={{ mt: 4, textAlign: "center" }}>
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
                "&:hover": {
                  color: "primary.dark",
                  textDecoration: "underline",
                },
              }}
            >
              Prihlásiť
            </Typography>
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default SignUpView;