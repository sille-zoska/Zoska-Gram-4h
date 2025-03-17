// src/views/auth/GithubSignButton.tsx

"use client";

// NextAuth imports
import { signIn } from "next-auth/react";

// MUI imports
import Button from "@mui/material/Button";
import GitHubIcon from "@mui/icons-material/GitHub";

// GitHub Sign-In Button Component
const GithubSignButton = ({ text }: { text: string }) => (
  <Button
    variant="outlined"
    fullWidth
    startIcon={<GitHubIcon />}
    onClick={() => signIn("github")}
    sx={{ mb: 1 }}
  >
    {text}
  </Button>
);

export default GithubSignButton;
