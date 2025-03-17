// src/views/auth/SignUpView.tsx

"use client";

// React imports
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

// MUI imports
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
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  School as SchoolIcon,
  Google as GoogleIcon,
} from "@mui/icons-material";

// Custom imports
import GoogleSignButton from "../../components/auth/GoogleSignButton";
import GithubSignButton from "../../components/auth/GithubSignButton";
import SignInUpViewLink from "../../components/CustomLink";

// Zod imports
import { z } from "zod";

// Validation schema
const signUpSchema = z.object({
  acceptedTerms: z.literal(true, {
    errorMap: () => ({ message: "Musíte súhlasiť s GDPR a podmienkami používania." }),
  }),
  // Uncomment for credentials registration
  // name: z.string().min(2, "Meno musí mať aspoň 2 znaky"),
  // email: z.string().email("Zadajte platný email"),
  // password: z.string().min(8, "Heslo musí mať aspoň 8 znakov"),
});

const SignUpView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams?.get("error");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isChecked, setIsChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    if (formError) {
      setFormError(null); // Clear error when checkbox is toggled
    }
  };

  const validateForm = () => {
    try {
      signUpSchema.parse({ 
        acceptedTerms: isChecked,
        // Uncomment for credentials registration
        // name: formData.name,
        // email: formData.email,
        // password: formData.password
      });
      return true;
    } catch (e) {
      if (e instanceof z.ZodError) {
        setFormError(e.errors[0].message);
      }
      return false;
    }
  };

  const handleGoogleSignUp = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await signIn("google", { callbackUrl: "/prispevok" });
    } catch (err) {
      setFormError("Registrácia cez Google zlyhala. Skúste to znova.");
      setLoading(false);
    }
  };

  // Currently commented out as we're only using Google OAuth
  /*
  const handleCredentialsSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // Here would be the code to register the user with credentials
      // 1. API call to create user in database
      // 2. Send verification email using SendGrid
      // 3. Redirect to verification page or sign in
      
      // Example:
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      //
      // if (!response.ok) {
      //   const data = await response.json();
      //   throw new Error(data.message || 'Registration failed');
      // }
      //
      // router.push('/auth/overenie');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Registrácia zlyhala. Skúste to znova.");
    } finally {
      setLoading(false);
    }
  };
  */

  // Map NextAuth error codes to user-friendly messages
  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case "OAuthSignin":
      case "OAuthCallback":
      case "OAuthCreateAccount":
        return "Nastal problém s registráciou cez Google. Skúste to znova.";
      default:
        return "Registrácia zlyhala. Skúste to znova.";
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 4,
        }}
      >
        <SchoolIcon
          sx={{
            fontSize: 50,
            mb: 2,
            color: "primary.main",
          }}
        />
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            background: "linear-gradient(45deg, #FF385C, #1DA1F2)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            mb: 1,
          }}
        >
          ZoškaGram
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center">
          Vytvorte si účet a pripojte sa k študentskej komunite
        </Typography>
      </Box>

      {(error || formError) && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error ? getErrorMessage(error) : formError}
        </Alert>
      )}

      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        {/* Terms and Conditions Checkbox */}
        <FormControlLabel
          control={
            <Checkbox checked={isChecked} onChange={handleCheckboxChange} />
          }
          label={
            <>
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
              </Link>{" "}
              a{" "}
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
              .
            </>
          }
          sx={{ mb: 3 }}
        />

        {/* Google Sign Up Button */}
        <Button
          fullWidth
          variant="outlined"
          onClick={handleGoogleSignUp}
          disabled={loading}
          startIcon={<GoogleIcon />}
          sx={{
            py: 1.2,
            borderRadius: 50,
            mb: 2,
            borderColor: "divider",
            "&:hover": {
              borderColor: "primary.main",
              bgcolor: "background.paper",
            },
          }}
        >
          Registrovať sa cez Google
        </Button>

        {/* Credentials Sign Up Form - Commented out for now */}
        {/*
        <Divider sx={{ my: 2 }}>
          <Typography variant="body2" color="text.secondary">
            alebo
          </Typography>
        </Divider>

        <Box component="form" onSubmit={handleCredentialsSignUp}>
          <TextField
            fullWidth
            label="Meno a priezvisko"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Heslo"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            required
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <PersonIcon />}
            sx={{
              mt: 3,
              mb: 2,
              py: 1.2,
              borderRadius: 50,
              fontWeight: 600,
            }}
          >
            {loading ? "Registrácia..." : "Zaregistrovať sa"}
          </Button>
        </Box>
        */}
      </Paper>

      <Box sx={{ mt: 3, textAlign: "center" }}>
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
                  textDecoration: "underline",
                },
              }}
            >
              Prihláste sa
            </Typography>
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default SignUpView;
