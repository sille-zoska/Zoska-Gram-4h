// src/views/auth/SignVerifyView.tsx

"use client";

// React imports
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

// MUI imports
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Paper from "@mui/material/Paper";

// SignVerify View Component
const SignVerifyView = () => {
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showCode, setShowCode] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Get email from URL params
    const emailParam = searchParams?.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 6) {
      setVerificationCode(value);
      setError(null);
    }
  };

  const handleVerify = async () => {
    if (!email) {
      setError("Email adresa chýba. Skúste sa vrátiť na stránku registrácie.");
      return;
    }
    
    if (verificationCode.length !== 6) {
      setError("Prosím zadajte 6-miestny kód");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code: verificationCode,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Nepodarilo sa overiť kód");
      }
      
      setSuccess("Email bol úspešne overený! Budete presmerovaní na prihlásenie...");
      
      // Wait for 2 seconds before redirecting to login page
      setTimeout(() => {
        router.push(`/auth/prihlasenie?email=${encodeURIComponent(email)}`);
      }, 2000);
      
    } catch (error) {
      console.error("Verification error:", error);
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setError("Email adresa chýba. Skúste sa vrátiť na stránku registrácie.");
      return;
    }

    setIsResending(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/auth/resend-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Nepodarilo sa odoslať kód");
      }
      
      setSuccess("Overovací kód bol odoslaný na váš email");
      setTimeout(() => setSuccess(null), 5000); // Hide success message after 5 seconds
      
    } catch (error) {
      console.error("Resend code error:", error);
      setError((error as Error).message);
    } finally {
      setIsResending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleVerify();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 3,
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          maxWidth: "480px",
          mx: "auto",
          mb: 4,
        }}
      >
        {/* Title */}
        <Typography 
          variant="h5" 
          sx={{ 
            mb: 3,
            fontWeight: 600,
            textAlign: 'center'
          }}
        >
          Overte svoj účet
        </Typography>

        {/* Instructions */}
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 3,
            textAlign: 'center',
            color: 'text.secondary'
          }}
        >
          {email ? (
            <>Zadajte 6-miestny kód, ktorý sme poslali na <strong>{email}</strong>.</>
          ) : (
            <>Zadajte 6-miestny kód, ktorý sme vám poslali na email.</>
          )}
        </Typography>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {/* Success Alert */}
        {success && (
          <Alert 
            severity="success" 
            sx={{ mb: 3 }}
            onClose={() => setSuccess(null)}
          >
            {success}
          </Alert>
        )}

        {/* 6-Digit Verification Code Input */}
        <TextField
          label="Overovací kód"
          type={showCode ? "text" : "password"}
          value={verificationCode}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          inputProps={{ 
            maxLength: 6,
            pattern: "[0-9]*",
            inputMode: "numeric",
            autoComplete: "one-time-code"
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowCode(!showCode)}
                  edge="end"
                >
                  {showCode ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ 
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main',
              },
            },
          }}
          fullWidth
          autoFocus
        />

        {/* Verify Button */}
        <Button
          variant="contained"
          onClick={handleVerify}
          disabled={isLoading || verificationCode.length !== 6}
          fullWidth
          sx={{
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
          }}
        >
          {isLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} color="inherit" />
              <span>Overovanie...</span>
            </Box>
          ) : (
            'Overiť'
          )}
        </Button>

        {/* Resend Code Option */}
        <Typography 
          variant="body2" 
          sx={{ 
            mt: 3,
            textAlign: 'center',
            color: 'text.secondary'
          }}
        >
          Nezískali ste kód?{' '}
          <Button
            variant="text"
            size="small"
            onClick={handleResendCode}
            disabled={isResending}
            sx={{
              textTransform: 'none',
              color: 'primary.main',
              '&:hover': {
                background: 'transparent',
              },
            }}
          >
            {isResending ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CircularProgress size={14} color="inherit" />
                <span>Odosielanie...</span>
              </Box>
            ) : (
              'Poslať znova'
            )}
          </Button>
        </Typography>

        {/* Back to Login */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Link href="/auth/prihlasenie" passHref>
            <Typography
              component="span"
              variant="body2"
              sx={{
                fontWeight: 500,
                color: 'primary.main',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
                cursor: 'pointer',
              }}
            >
              ← Späť na prihlásenie
            </Typography>
          </Link>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default SignVerifyView;
