// src/sections/NonAuthHomeView.tsx

"use client";

import { useTheme } from "@mui/material/styles";
import { Container, Typography, Grid, Button, Box } from "@mui/material";
import Image from "next/image";

export default function NonAuthHomeView() {
  const theme = useTheme();
  return (
    <Container>
      <Typography variant="h3" align="center" gutterBottom>
        Vitajte na ZoškaSnap!
      </Typography>
      <Typography variant="h6" align="center" gutterBottom>
        Pridajte sa k našej školskej komunite a zdieľajte svoje momenty.
      </Typography>

      <Typography variant="body1" align="center" gutterBottom>
        ZoškaSnap je miesto, kde môžete zdieľať svoje najlepšie momenty so svojimi spolužiakmi. 
        Pridajte sa k nám a buďte súčasťou našej rastúcej komunity. 
        Zdieľajte fotografie, komentujte a lajkujte príspevky svojich priateľov.
      </Typography>

      <Typography variant="body1" align="center" gutterBottom>
        Naša platforma je navrhnutá tak, aby bola jednoduchá a intuitívna na používanie. 
        Stačí sa zaregistrovať, vytvoriť si profil a začať zdieľať svoje zážitky. 
        Či už ste na školskom výlete, na športovom podujatí alebo len tak trávite čas s priateľmi, 
        ZoškaSnap je tu pre vás.
      </Typography>

      <Grid container spacing={4} justifyContent="center" sx={{ mt: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Image
            src="/images/home1.png"
            alt="Obrázok z galérie 1"
            width={300}
            height={200}
            style={{ borderRadius: "8px" }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Image
            src="/images/home2.png"
            alt="Obrázok z galérie 2"
            width={300}
            height={200}
            style={{ borderRadius: "8px" }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Image
            src="/images/home3.png"
            alt="Obrázok z galérie 3"
            width={300}
            height={200}
            style={{ borderRadius: "8px" }}
          />
        </Grid>
      </Grid>

      <Typography variant="body1" align="center" gutterBottom sx={{ mt: 4 }}>
        Nezmeškajte žiadne novinky a udalosti. 
        Pridajte sa k nám ešte dnes a buďte informovaní o všetkom, čo sa deje v našej škole. 
        Zaregistrujte sa teraz a začnite zdieľať svoje momenty s ostatnými.
      </Typography>

      <Box textAlign="center" sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          href="/auth/registracia"
          sx={{ mt: 2 }}
        >
          Zaregistrujte sa teraz
        </Button>
      </Box>
    </Container>
  );
}

