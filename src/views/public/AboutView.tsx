// src/views/public/AboutView.tsx

"use client";

import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";

// MUI imports
import { Container, Typography, Grid, Box, Paper, IconButton, Link } from "@mui/material";
import Image from "next/image";
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import SchoolIcon from '@mui/icons-material/School';

// Custom imports
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

export default function AboutView() {
  const theme = useTheme();

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography 
          variant="h2" 
          align="center" 
          gutterBottom
          sx={{
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            fontWeight: 700,
            mb: 2
          }}
        >
          {aboutContent.title}
        </Typography>
        <Typography 
          variant="h5" 
          align="center" 
          color="text.secondary"
          gutterBottom
          sx={{ mb: 4 }}
        >
          {aboutContent.subtitle}
        </Typography>
      </motion.div>

      {/* Introduction */}
      <motion.div {...fadeInUp}>
        <Typography 
          variant="body1" 
          align="center" 
          paragraph
          sx={{ 
            maxWidth: '800px',
            mx: 'auto',
            mb: 6,
            fontSize: '1.1rem',
            lineHeight: 1.8
          }}
        >
          {aboutContent.introduction}
        </Typography>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {aboutContent.features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div {...fadeInUp}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
                    borderRadius: 4,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: theme.shadows[8],
                    }
                  }}
                >
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      {/* Image Gallery */}
      <motion.div {...fadeInUp}>
        <Grid container spacing={4} justifyContent="center" sx={{ mb: 8 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Box
              sx={{
                position: 'relative',
                height: '300px',
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: theme.shadows[4],
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: theme.shadows[8],
                }
              }}
            >
              <Image
                src="/images/about1.png"
                alt="ZoskaGram momentka 1"
                fill
                style={{ objectFit: 'cover' }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box
              sx={{
                position: 'relative',
                height: '300px',
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: theme.shadows[4],
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: theme.shadows[8],
                }
              }}
            >
              <Image
                src="/images/about2.png"
                alt="ZoskaGram momentka 2"
                fill
                style={{ objectFit: 'cover' }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box
              sx={{
                position: 'relative',
                height: '300px',
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: theme.shadows[4],
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: theme.shadows[8],
                }
              }}
            >
              <Image
                src="/images/about3.png"
                alt="ZoskaGram momentka 3"
                fill
                style={{ objectFit: 'cover' }}
              />
            </Box>
          </Grid>
        </Grid>
      </motion.div>

      {/* Footer Section */}
      <motion.div {...fadeInUp}>
        <Typography 
          variant="body1" 
          align="center" 
          paragraph
          sx={{ 
            maxWidth: '800px',
            mx: 'auto',
            mb: 4,
            fontSize: '1.1rem',
            lineHeight: 1.8
          }}
        >
          {aboutContent.footer}
        </Typography>

        {/* Social Links */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
          {aboutContent.links.map((link, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <IconButton
                component={Link}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: theme.palette.primary.main,
                  '&:hover': {
                    color: theme.palette.primary.dark,
                  }
                }}
              >
                {link.icon === 'facebook' && <FacebookIcon />}
                {link.icon === 'photo_camera' && <InstagramIcon />}
                {link.icon === 'school' && <SchoolIcon />}
              </IconButton>
            </motion.div>
          ))}
        </Box>
      </motion.div>
    </Container>
  );
}
