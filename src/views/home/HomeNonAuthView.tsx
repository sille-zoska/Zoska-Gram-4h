// src/sections/NonAuthHomeView.tsx

"use client";

// React imports
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// MUI imports
import { Box, Container, Typography, Button, Paper, useTheme } from "@mui/material";
import { School as SchoolIcon } from "@mui/icons-material";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

/**
 * HomeNonAuthView Component
 * 
 * Landing page for non-authenticated users with strong call-to-action
 * and value proposition for the ZoskaGram platform.
 */
const HomeNonAuthView = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        bgcolor: "background.default",
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
          py: { xs: 4, sm: 6 },
          px: { xs: 2, sm: 3 },
        }}
      >
        {/* Logo and Title Section */}
        <motion.div {...fadeInUp}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: { xs: 4, sm: 6 },
            }}
          >
            {/* Logo and Badge */}
            <Box
              sx={{
                position: "relative",
                mb: 3,
              }}
            >
              <SchoolIcon
                sx={{
                  fontSize: { xs: 60, sm: 72 },
                  color: "primary.main",
                  filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                  bgcolor: "secondary.main",
                  color: "white",
                  px: 1,
                  py: 0.5,
                  borderRadius: "12px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                BETA
              </Box>
            </Box>

            {/* Title */}
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2.5rem", sm: "3.5rem" },
                fontWeight: 800,
                mb: 2,
                textAlign: "center",
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              ZoškaGram
            </Typography>

            {/* Description */}
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "1.25rem", sm: "1.5rem" },
                color: "text.secondary",
                mb: 4,
                maxWidth: "480px",
                textAlign: "center",
              }}
            >
              Tvoja školská sociálna sieť, kde môžeš zdieľať svoje úspechy, projekty a zážitky so spolužiakmi SPŠE Zochova
            </Typography>

            {/* Hero Image */}
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: { xs: "300px", sm: "400px" },
                borderRadius: 4,
                overflow: "hidden",
                boxShadow: "0 24px 48px rgba(0,0,0,0.1)",
                mb: 4,
              }}
            >
              <Image
                src="/images/home/zoskagram-home1.png"
                alt="ZoskaGram ukážka aplikácie"
                fill
                style={{ 
                  objectFit: "cover",
                  objectPosition: "center",
                }}
                priority
              />
            </Box>

            {/* CTA Buttons */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                width: "100%",
                mb: 6,
              }}
            >
              <Button
                component={Link}
                href="/auth/registracia"
                variant="contained"
                fullWidth
                size="large"
                sx={{
                  py: 2,
                  borderRadius: 50,
                  fontSize: { xs: "1rem", sm: "1.125rem" },
                  fontWeight: 600,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  boxShadow: "0 8px 16px rgba(255,56,92,0.25)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 20px rgba(255,56,92,0.35)",
                  },
                }}
              >
                Pridaj sa k nám
              </Button>
              <Button
                component={Link}
                href="/auth/prihlasenie"
                variant="outlined"
                fullWidth
                size="large"
                sx={{
                  py: 2,
                  borderRadius: 50,
                  fontSize: { xs: "1rem", sm: "1.125rem" },
                  fontWeight: 600,
                  borderWidth: 2,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderWidth: 2,
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                  },
                }}
              >
                Prihlásiť
              </Button>
            </Box>

            {/* Features */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                gap: 2,
                width: "100%",
              }}
            >
              {[
                {
                  title: "Zdieľaj úspechy",
                  description: "Ukáž svoje projekty a školské úspechy ostatným",
                },
                {
                  title: "Buď v spojení",
                  description: "Zostaň v kontakte so spolužiakmi a učiteľmi",
                },
                {
                  title: "Inšpiruj ostatných",
                  description: "Motivuj mladších študentov svojimi príspevkami",
                },
              ].map((feature, index) => (
                <Paper
                  key={index}
                  elevation={0}
                  sx={{
                    p: 3,
                    backgroundColor: "background.paper",
                    borderRadius: 2,
                    transition: "all 0.3s ease",
                    border: "1px solid",
                    borderColor: "divider",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 1,
                      fontWeight: 600,
                      fontSize: { xs: "1rem", sm: "1.125rem" },
                      color: "primary.main",
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default HomeNonAuthView;

