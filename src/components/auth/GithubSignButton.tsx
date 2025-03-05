// src/components/auth/GithubSignButton.tsx

"use client";

// NextAuth imports
import { signIn } from "next-auth/react";

// MUI imports
import Button from "@mui/material/Button";

// MUI Icons
import GitHubIcon from "@mui/icons-material/GitHub";

// TypeScript interfaces
interface GithubSignButtonProps {
  /** Text to display on the button */
  text: string;
  /** Optional validation function before sign in */
  handleSubmit?: () => boolean;
}

// GitHub authentication button component
const GithubSignButton = ({ text, handleSubmit }: GithubSignButtonProps) => {
  // Handle button click with optional validation
  const handleClick = () => {
    if (!handleSubmit || handleSubmit()) {
      signIn("github");
    }
  };

  return (
    <Button
      variant="outlined"
      fullWidth
      startIcon={<GitHubIcon />}
      onClick={handleClick}
      sx={{ mb: 1 }}
    >
      {text}
    </Button>
  );
};

export default GithubSignButton;
