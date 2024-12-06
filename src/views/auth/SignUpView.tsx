// src/views/auth/SignUpView.tsx

"use client";

// React imports
import { useState } from "react";

// MUI imports
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Alert from "@mui/material/Alert";

// Custom imports
import GoogleSignButton from "../../components/auth/GoogleSignButton";
import GithubSignButton from "../../components/auth/GithubSignButton";
import SignInUpViewLink from "../../components/CustomLink";

// Zod imports
import { z } from "zod";

// Validation schema for terms acceptance
const signUpSchema = z.object({
  acceptedTerms: z.literal(true, {
    errorMap: () => ({ message: "Musíte súhlasiť s GDPR a podmienkami používania." }),
  }),
});

const SignUpView = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    if (error) {
      setError(null); // Clear error when checkbox is toggled
    }
  };

  const handleSubmit = () => {
    try {
      signUpSchema.parse({ acceptedTerms: isChecked });
      return true; // Validation successful
    } catch (e) {
      if (e instanceof z.ZodError) {
        setError(e.errors[0].message); // Set error message for display
      }
      return false; // Validation failed
    }
  };

  return (
    <>
      {/* Title */}
      <Typography variant="h5" sx={{ mb: 3 }}>
        Registrácia
      </Typography>

      {/* Link to sign-in */}
      <Typography variant="body1" sx={{ mb: 6 }}>
        Už máte účet?{" "}
        <SignInUpViewLink href="/auth/prihlasenie" text="Prihláste sa" />
      </Typography>

      {/* Error alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* GDPR and Terms Agreement */}
      <FormControlLabel
        control={
          <Checkbox checked={isChecked} onChange={handleCheckboxChange} />
        }
        label={
          <>
            Súhlasím s <SignInUpViewLink href="/gdpr" text="GDPR" /> a{" "}
            <SignInUpViewLink href="/podmienky" text="podmienkami používania" />.
          </>
        }
        sx={{ mb: 3 }}
      />

      {/* Social Sign-Up Buttons with validation */}
      <GoogleSignButton text="Registrovať sa účtom Google" handleSubmit={handleSubmit} />
      <GithubSignButton text="Registrovať sa účtom Github" handleSubmit={handleSubmit} />
    </>
  );
};

export default SignUpView;
