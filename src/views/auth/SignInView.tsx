// src/views/auth/SignInView.tsx

"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
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
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  School as SchoolIcon,
  Google as GoogleIcon,
} from "@mui/icons-material";

const SignInView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams?.get("error");
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        setFormError("Nesprávny email alebo heslo");
      } else {
        // Redirect to feed page
        router.push("/prispevok");
      }
    } catch (err) {
      setFormError("Prihlásenie zlyhalo. Skúste to znova.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signIn("google", { callbackUrl: "/prispevok" });
    } catch (err) {
      setFormError("Prihlásenie cez Google zlyhalo. Skúste to znova.");
      setLoading(false);
    }
  };

  // Map NextAuth error codes to user-friendly messages
  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case "OAuthSignin":
      case "OAuthCallback":
      case "OAuthCreateAccount":
        return "Nastal problém s prihlásením cez Google. Skúste to znova.";
      case "EmailSignin":
        return "Nastal problém s odoslaním prihlasovacieho odkazu. Skúste to znova.";
      case "Callback":
        return "Neplatný prihlasovací odkaz alebo vypršala jeho platnosť.";
      case "CredentialsSignin":
        return "Nesprávny email alebo heslo.";
      default:
        return "Prihlásenie zlyhalo. Skúste to znova.";
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
          Vitajte späť! Prihláste sa do svojho účtu
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
        {/* Google Sign In Button */}
        <Button
          fullWidth
          variant="outlined"
          onClick={handleGoogleSignIn}
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
          Prihlásiť sa cez Google
        </Button>

        <Divider sx={{ my: 2 }}>
          <Typography variant="body2" color="text.secondary">
            alebo
          </Typography>
        </Divider>

        {/* Credentials Sign In Form - Commented out for now */}
        {/* <Box component="form" onSubmit={handleCredentialsSignIn}>
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
            startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
            sx={{
              mt: 3,
              mb: 2,
              py: 1.2,
              borderRadius: 50,
              fontWeight: 600,
            }}
          >
            {loading ? "Prihlasovanie..." : "Prihlásiť sa"}
          </Button>

          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
            <Link href="/auth/zabudnute-heslo" passHref>
              <Typography
                component="span"
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: "secondary.main",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Zabudli ste heslo?
              </Typography>
            </Link>
          </Typography>
        </Box> */}
      </Paper>

      <Box sx={{ mt: 3, textAlign: "center" }}>
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
                  textDecoration: "underline",
                },
              }}
            >
              Zaregistrujte sa
    </Typography>
          </Link>
    </Typography>
      </Box>
    </Box>
);
};

export default SignInView;
