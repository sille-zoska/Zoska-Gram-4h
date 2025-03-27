// src/views/auth/SignVerifyView.tsx

"use client";

// React imports
import { useState } from "react";
import { motion } from "framer-motion";

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

// SignVerify View Component
const SignVerifyView = () => {
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showCode, setShowCode] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 6) {
      setVerificationCode(value);
      setError(null);
    }
  };

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      setError("Prosím zadajte 6-miestny kód");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Add your verification logic here
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulated API call
      console.log("Verification code entered:", verificationCode);
      // Handle successful verification
    } catch (err) {
      setError("Nepodarilo sa overiť kód. Skúste to prosím znova.");
    } finally {
      setIsLoading(false);
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
        Zadajte 6-miestny kód, ktorý sme vám poslali na email.
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
          onClick={() => {
            // Add resend logic here
            console.log("Resend code requested");
          }}
          sx={{
            textTransform: 'none',
            color: 'primary.main',
            '&:hover': {
              background: 'transparent',
            },
          }}
        >
          Poslať znova
        </Button>
      </Typography>
    </motion.div>
  );
};

export default SignVerifyView;
