// src/components/BackButton.tsx

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

// MUI Icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// TypeScript interfaces
interface BackButtonProps {
  /** Optional button text, defaults to "Späť" */
  text?: string;
  /** Material-UI button color variant */
  color?: "inherit" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
}

// Back button component with history navigation
const BackButton = ({ text = "Späť", color = "primary" }: BackButtonProps) => {
  // Navigate back or to home if no history
  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  };

  return (
    <Button
      variant="outlined"
      color={color}
      startIcon={<ArrowBackIcon />}
      onClick={handleGoBack}
      sx={{ mt: 4 }}
    >
      {text}
    </Button>
  );
};

export default BackButton;
