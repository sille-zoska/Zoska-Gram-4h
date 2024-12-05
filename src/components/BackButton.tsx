// src/components/auth/BackButton.tsx

/**
 * @file BackButton.tsx
 * @description
 * A reusable "Back" button component for navigating to the previous page in the browser history.
 * If no history is available, it redirects the user to the home page (`/`).
 * 
 * @usage
 * This component is intended for use in pages or views where the user needs an easy way to return 
 * to the previous page, such as terms of service, privacy policy, or multi-step forms.
 * 
 * @props
 * - `text` (optional): The text displayed on the button. Defaults to "Späť".
 * - `color` (optional): The color of the button. Accepts any valid Material-UI button color (e.g., "primary", "secondary").
 *   Defaults to "primary".
 * 
 * @example
 * // Example usage in a React component:
 * import BackButton from "@/components/auth/BackButton";
 * 
 * const SomeView = () => (
 *   <div>
 *     <h1>Some Page</h1>
 *     <BackButton text="Go Back" color="secondary" />
 *   </div>
 * );
 */

"use client";

// MUI imports
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Props interface for flexibility
interface BackButtonProps {
  text?: string; // Optional button text
  color?: "inherit" | "primary" | "secondary" | "error" | "info" | "success" | "warning"; // Material-UI button colors
}

const BackButton = ({ text = "Späť", color = "primary" }: BackButtonProps) => {
  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back(); // Go back to the previous page
    } else {
      window.location.href = "/"; // Fallback to home page if no history
    }
  };

  return (
    <Button
      variant="outlined"
      color={color} // Use the passed color prop
      startIcon={<ArrowBackIcon />}
      onClick={handleGoBack}
      sx={{
        mt: 4,
      }}
    >
      {text}
    </Button>
  );
};

export default BackButton;
