// src/sections/NonAuthHomeView.tsx

"use client";

import { Box, Container, Typography, Button, Grid, Paper } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

const HomeNonAuthView = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Grid container spacing={4} alignItems="center">
        {/* Left side - Hero content */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                fontWeight: 700,
                background: "linear-gradient(45deg, #FF385C, #1DA1F2)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                mb: 2,
              }}
            >
              ZoškaGram
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "1.5rem", md: "2rem" },
                fontWeight: 500,
                color: "text.secondary",
                mb: 3,
              }}
            >
              Zdieľaj svoje školské momenty s ostatnými študentmi SPŠE Zochova
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                component={Link}
                href="/auth/registracia"
                variant="contained"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: "50px",
                  fontSize: "1.1rem",
                }}
              >
                Pridaj sa k nám
              </Button>
              <Button
                component={Link}
                href="/auth/prihlasenie"
                variant="outlined"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: "50px",
                  fontSize: "1.1rem",
                }}
              >
                Prihlásiť sa
              </Button>
            </Box>
          </Box>

          {/* Features */}
          <Grid container spacing={2} sx={{ mt: 4 }}>
            {[
              {
                title: "Zdieľaj momenty",
                description: "Fotky z projektov, školských akcií a každodenného života",
              },
              {
                title: "Buď v spojení",
                description: "Komunikuj so spolužiakmi a zostaň v obraze",
              },
              {
                title: "Buduj komunitu",
                description: "Vytváraj a objavuj obsah pre študentov SPŠE Zochova",
              },
            ].map((feature, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    height: "100%",
                    backgroundColor: "background.paper",
                    borderRadius: 2,
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Right side - Preview Image */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              position: "relative",
              height: { xs: "400px", md: "600px" },
              borderRadius: 4,
              overflow: "hidden",
              boxShadow: (theme) => `0 24px 48px ${theme.palette.primary.main}20`,
            }}
          >
            <Image
              src="/images/home/zoskagram-home1.png" 
              alt="ZoškaGram App Preview"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomeNonAuthView;

