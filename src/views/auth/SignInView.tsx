// src/views/auth/SignInView.tsx

"use client";

// MUI imports
import Typography from "@mui/material/Typography";

<<<<<<< HEAD
// Relative imports
import GoogleSignButton from "./GoogleSignButton";
import GithubSignButton from "./GithubSignButton";
import SignInUpViewLink from "./SignInUpViewLink";
=======
// Custom imports
import GoogleSignButton from "../../components/auth/GoogleSignButton";
import GithubSignButton from "../../components/auth/GithubSignButton";
import SignInUpViewLink from "../../components/CustomLink";
>>>>>>> c12de16 (Initial commit with all project files)

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
