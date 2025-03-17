// src/components/CustomLink.tsx

"use client";

// MUI imports
import Link from "@mui/material/Link";

// Props type
interface CustomLinkProps {
  href: string;
  text: string;
}

const SignInUpViewLink = ({ href, text }: CustomLinkProps) => (
  <Link
    href={href}
    sx={{
      color: "secondary.main", // Theme's secondary color
      fontWeight: "bold", // Bold text
      textDecoration: "none", // Remove underline
      "&:hover": {
        textDecoration: "underline", // Add underline on hover
      },
    }}
  >
    {text}
  </Link>
);

export default SignInUpViewLink;
