"use client";

// NextAuth imports
import { signOut } from "next-auth/react";

// MUI imports
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";


// SignOut View Component
const SignOutView = () => (
  <>
    <Typography variant="h5" sx={{ mb: 3 }}>
      Naozaj sa chcete odhlásiť?
    </Typography>
    <Button variant="contained" color="primary" onClick={() => signOut()} fullWidth>
      Odhlásiť sa
    </Button>
  </>
);

export default SignOutView;
