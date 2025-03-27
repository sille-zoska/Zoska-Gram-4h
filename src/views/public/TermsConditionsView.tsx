// src/views/public/TermsConditionsView.tsx

'use client'

import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";

// MUI imports
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Icon from "@mui/material/Icon";

// Project imports
import BackButton from "@/components/BackButton";

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

const TermsConditionsView = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      {/* Title Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography 
          variant="h2" 
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
          {termsContent.title}
        </Typography>
        <Typography 
          variant="h5" 
          color="text.secondary"
          gutterBottom
          sx={{ mb: 4 }}
        >
          {termsContent.subtitle}
        </Typography>
      </motion.div>

      {/* Introduction */}
      <motion.div {...fadeInUp}>
        <Typography 
          variant="body1" 
          paragraph
          sx={{ 
            fontSize: '1.1rem',
            lineHeight: 1.8,
            mb: 6
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
                p: 4,
                mb: 4,
                background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
                borderRadius: 4,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[4],
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {section.icon && (
                  <Icon 
                    sx={{ 
                      mr: 2, 
                      color: theme.palette.primary.main,
                      fontSize: '2rem'
                    }}
                  >
                    {section.icon}
                  </Icon>
                )}
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    color: theme.palette.primary.main
                  }}
                >
                  {section.heading}
                </Typography>
              </Box>
              <Typography 
                variant="body1" 
                sx={{ 
                  lineHeight: 1.8,
                  pl: section.icon ? 7 : 0
                }}
              >
                {section.text}
              </Typography>
            </Paper>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer */}
      <motion.div {...fadeInUp}>
        <Typography 
          variant="body1" 
          sx={{ 
            mt: 6,
            mb: 4,
            fontSize: '1.1rem',
            lineHeight: 1.8
          }}
        >
          {termsContent.footer}
        </Typography>

        {/* Last Updated */}
        <Typography 
          variant="caption" 
          color="text.secondary"
          sx={{ 
            display: 'block',
            mb: 4,
            fontStyle: 'italic'
          }}
        >
          Posledná aktualizácia: {termsContent.lastUpdated}
        </Typography>

        {/* Back Button */}
        <BackButton />
      </motion.div>
    </Container>
  );
};

export default TermsConditionsView;
