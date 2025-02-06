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
        Welcome to ZoškaSnap!
      </Typography>
      <Typography variant="h6" align="center" gutterBottom>
        Join our school community and share your moments.
      </Typography>

      <Grid container spacing={4} justifyContent="center" sx={{ mt: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Image
            src="/images/gallery1.jpg"
            alt="Gallery Image 1"
            width={300}
            height={200}
            style={{ borderRadius: "8px" }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Image
            src="/images/gallery2.jpg"
            alt="Gallery Image 2"
            width={300}
            height={200}
            style={{ borderRadius: "8px" }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Image
            src="/images/gallery3.jpg"
            alt="Gallery Image 3"
            width={300}
            height={200}
            style={{ borderRadius: "8px" }}
          />
        </Grid>
      </Grid>

      <Box textAlign="center" sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          href="/auth/registracia"
          sx={{ mt: 2 }}
        >
          Register Now
        </Button>
      </Box>
    </Container>
  );
}

