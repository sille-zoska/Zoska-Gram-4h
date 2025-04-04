// src/views/public/AboutView.tsx

"use client";

// React imports
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";

// MUI imports
import {
  Typography,
  Box,
  Paper,
  Zoom,
  Button,
  Grid,
} from "@mui/material";

// Content import
import aboutContent from "@/content/aboutContent";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

/**
 * AboutView Component
 * 
 * Displays information about ZoskaGram in a mobile-first,
 * user-friendly format that matches the auth views design.
 */
const AboutView = () => {
  const theme = useTheme();

  return (
    <Box sx={{ maxWidth: '800px', mx: 'auto', px: 3, py: 4 }}>
      {/* Title Section */}
      <Zoom in timeout={500} style={{ transitionDelay: "100ms" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 6,
          }}
        >
          <Typography
            variant="h3"
            sx={{
              mb: 2,
              textAlign: "center",
              fontWeight: 700,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {aboutContent.title}
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            align="center"
            sx={{
              fontSize: "1.1rem",
            }}
          >
            {aboutContent.subtitle}
          </Typography>
        </Box>
      </Zoom>

      {/* Introduction */}
      <motion.div {...fadeInUp}>
        <Typography 
          variant="body1" 
          paragraph
          sx={{ 
            fontSize: "1rem",
            lineHeight: 1.8,
            mb: 4,
            textAlign: {
              xs: 'left',
              sm: 'center'
            }
          }}
        >
          {aboutContent.introduction}
        </Typography>
      </motion.div>

      {/* Features */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <Grid container spacing={3}>
          {aboutContent.features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div {...fadeInUp}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: '100%',
                    background: theme.palette.background.paper,
                    borderRadius: 2,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[4],
                    }
                  }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      color: theme.palette.primary.main,
                      mb: 1,
                      fontSize: "1.1rem"
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      lineHeight: 1.6,
                      color: theme.palette.text.secondary
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      {/* Links */}
      <motion.div {...fadeInUp}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            mt: 6,
            flexWrap: 'wrap'
          }}
        >
          {aboutContent.links.map((link, index) => (
            <Button
              key={index}
              component="a"
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              sx={{
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                color: 'white',
                transition: 'all 0.3s ease',
                textTransform: 'none',
                '&:hover': {
                  background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                  transform: 'translateY(-2px)',
                  boxShadow: `0 4px 8px ${theme.palette.primary.main}30`,
                }
              }}
            >
              {link.label}
            </Button>
          ))}
        </Box>
      </motion.div>

      {/* Footer */}
      <motion.div {...fadeInUp}>
        <Typography 
          variant="body1" 
          sx={{ 
            mt: 6,
            mb: 3,
            fontSize: "1rem",
            lineHeight: 1.8,
            textAlign: {
              xs: 'left',
              sm: 'center'
            }
          }}
        >
          {aboutContent.footer}
        </Typography>
      </motion.div>
    </Box>
  );
};

export default AboutView;
