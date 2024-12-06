// src/views/auth/SignInView.tsx

"use client";

// MUI imports
import Typography from "@mui/material/Typography";

// Custom imports
import GoogleSignButton from "../../components/auth/GoogleSignButton";
import GithubSignButton from "../../components/auth/GithubSignButton";
import SignInUpViewLink from "../../components/CustomLink";

const SignInView = () => (
  <>
    <Typography variant="h5" sx={{ mb: 3 }}>
      Prihlásenie
    </Typography>
    <Typography variant="body1" sx={{ mb: 6 }}>
      Ešte nemáte účet?{" "}
      <SignInUpViewLink href="/auth/registracia" text="Registrujte sa" />
    </Typography>
    <GoogleSignButton text="Prihlásiť sa účtom Google" />
    <GithubSignButton text="Prihlásiť sa účtom Github" />
  </>
);

export default SignInView;
