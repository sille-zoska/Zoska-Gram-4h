// src/views/public/TermsConditionsView.tsx

'use client'

// React imports
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import { useRouter } from "next/navigation";

// MUI imports
import {
  Typography,
  Box,
  Paper,
  Zoom,
  Button,
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Content import
import termsContent from "@/content/termsContent";

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
 * TermsConditionsView Component
 * 
 * Displays terms and conditions in a mobile-first,
 * user-friendly format that matches the auth views design.
 */
const TermsConditionsView = () => {
  const theme = useTheme();
  const router = useRouter();

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
            {termsContent.title}
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            align="center"
            sx={{
              fontSize: "1.1rem",
            }}
          >
            {termsContent.subtitle}
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
          {termsContent.introduction}
        </Typography>
      </motion.div>

      {/* Sections */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {termsContent.sections.map((section, index) => (
          <motion.div key={index} {...fadeInUp}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                background: theme.palette.background.paper,
                borderRadius: 2,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[4],
                }
              }}
            >
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    color: theme.palette.primary.main,
                    mb: 1,
                    fontSize: "1.1rem"
                  }}
                >
                  {section.heading}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    lineHeight: 1.6,
                    color: theme.palette.text.secondary
                  }}
                >
                  {section.text}
                </Typography>
              </Box>
            </Paper>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer */}
      <motion.div {...fadeInUp}>
        {/* Back Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            onClick={() => router.back()}
            startIcon={<ArrowBackIcon />}
            variant="contained"
            sx={{
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: 'white',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                transform: 'translateY(-2px)',
                boxShadow: `0 4px 8px ${theme.palette.primary.main}30`,
              }
            }}
          >
            Späť
          </Button>
        </Box>
      </motion.div>
    </Box>
  );
};

export default TermsConditionsView;
