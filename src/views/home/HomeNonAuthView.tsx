// src/sections/NonAuthHomeView.tsx

"use client";

import { useTheme } from "@mui/material/styles";
import { Container, Typography } from "@mui/material";

export default function NonAuthHomeView() {
  const theme = useTheme();
  return (
    <Container>
      <Typography variant="h3">Domovská stránka - NEprihlásený user</Typography>
      <Typography style={{ color: theme.palette.primary.main }} variant="h6">
        Registrujte sa, aby ste mohli pridať príspevky a zobraziť profil.
      </Typography>
    </Container>
  );
}

