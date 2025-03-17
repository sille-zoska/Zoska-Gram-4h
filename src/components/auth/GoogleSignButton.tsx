// src/components/auth/GoogleSignButton.tsx

"use client";

// NextAuth imports
import { signIn } from "next-auth/react";

// MUI imports
import Button from "@mui/material/Button";

// MUI Icons
import GoogleIcon from "@mui/icons-material/Google";

// TypeScript interfaces
interface GoogleSignButtonProps {
  /** Text to display on the button */
  text: string;
  /** Optional validation function before sign in */
  handleSubmit?: () => boolean;
}

// Google authentication button component
const GoogleSignButton = ({ text, handleSubmit }: GoogleSignButtonProps) => {
  // Handle button click with optional validation
  const handleClick = () => {
    if (!handleSubmit || handleSubmit()) {
      signIn("google");
    }
  };

  return (
    <Button
      variant="outlined"
      fullWidth
      startIcon={<GoogleIcon />}
      onClick={handleClick}
      sx={{ mb: 1 }}
    >
      {text}
    </Button>
  );
};

export default GoogleSignButton;
