// src/views/auth/GoogleSignButton.tsx

"use client";

// NextAuth imports
import { signIn } from "next-auth/react";

// MUI imports
import Button from "@mui/material/Button";
import GoogleIcon from "@mui/icons-material/Google";

// Google Sign-In Button Component
const GoogleSignButton = ({ text }: { text: string }) => (
  <Button
    variant="outlined"
    fullWidth
    startIcon={<GoogleIcon />}
    onClick={() => signIn("google")}
    sx={{ mb: 1 }}
  >
    {text}
  </Button>
);

export default GoogleSignButton;
