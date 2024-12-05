// src/views/auth/SignVerifyView.tsx

"use client";

// React imports
import { useState } from "react";

// MUI imports
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";


// SignVerify View Component
const SignVerifyView = () => {
  const [verificationCode, setVerificationCode] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 6) {
      setVerificationCode(value); // Only allow up to 6 digits
    }
  };

  const handleVerify = () => {
    // Add logic to verify the entered code (e.g., via an API call)
    console.log("Verification code entered:", verificationCode);
  };

  return (
    <>
      {/* Title */}
      <Typography variant="h5" sx={{ mb: 3 }}>
        Overte svoj účet
      </Typography>

      {/* Instructions */}
      <Typography variant="body1" sx={{ mb: 3 }}>
        Zadajte 6-miestny kód, ktorý sme vám poslali na email.
      </Typography>

      {/* 6-Digit Verification Code Input */}
      <TextField
        label="Overovací kód"
        type="text"
        value={verificationCode}
        onChange={handleChange}
        inputProps={{ maxLength: 6, pattern: "[0-9]*" }} // Restrict to 6 numeric digits
        sx={{ mb: 3 }}
        fullWidth
      />

      {/* Verify Button */}
      <Button variant="contained" onClick={handleVerify} fullWidth>
        Overiť
      </Button>
    </>
  );
};

export default SignVerifyView;
