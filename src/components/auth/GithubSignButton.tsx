// src/views/auth/GithubSignButton.tsx

"use client";

// NextAuth imports
import { signIn } from "next-auth/react";

// MUI imports
import Button from "@mui/material/Button";
import GitHubIcon from "@mui/icons-material/GitHub";

interface GithubSignButtonProps {
  text: string;
  handleSubmit?: () => boolean; // Optional validation function
}

const GithubSignButton = ({ text, handleSubmit }: GithubSignButtonProps) => {
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
