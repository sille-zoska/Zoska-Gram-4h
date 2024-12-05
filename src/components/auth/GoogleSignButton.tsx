// src/views/auth/GoogleSignButton.tsx

"use client";

// NextAuth imports
import { signIn } from "next-auth/react";

// MUI imports
import Button from "@mui/material/Button";
import GoogleIcon from "@mui/icons-material/Google";

interface GoogleSignButtonProps {
  text: string;
  handleSubmit?: () => boolean; // Optional validation function
}

const GoogleSignButton = ({ text, handleSubmit }: GoogleSignButtonProps) => {
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
