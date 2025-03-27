"use client";

import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import { School as SchoolIcon } from "@mui/icons-material";

/**
 * LoadingScreen Component
 * 
 * Full-screen loading component with animations.
 * Features:
 * - Animated school icon
 * - Beta badge
 * - Gradient text
 * - Loading spinner
 * - Smooth transitions
 * - Background pattern
 */
const LoadingScreen = () => {
  const theme = useTheme();

  return (
    <Box
      className="fade-in"
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        zIndex: 9999,
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 50% 50%, ${theme.palette.primary.main}15, transparent 70%)`,
          animation: "pulse 4s ease-in-out infinite",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          p: 4,
          borderRadius: 4,
          backdropFilter: "blur(8px)",
          backgroundColor: `${theme.palette.background.paper}80`,
          boxShadow: `0 8px 32px ${theme.palette.primary.main}20`,
          animation: "float 3s ease-in-out infinite",
        }}
      >
        <Box
          sx={{
            position: "relative",
            animation: "bounce 2s ease-in-out infinite",
          }}
        >
          <SchoolIcon
            sx={{
              fontSize: 72,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
              animation: "spin 10s linear infinite",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: -10,
              right: -10,
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              animation: "pulse 2s ease-in-out infinite",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "white",
                fontWeight: 700,
                fontSize: "0.75rem",
                textShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }}
            >
              BETA
            </Typography>
          </Box>
        </Box>
        <Typography
          variant="h3"
          sx={{
            textAlign: "center",
            mb: 2,
            fontWeight: 700,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            textShadow: "0 2px 4px rgba(0,0,0,0.1)",
            letterSpacing: "-0.5px",
            animation: "scale 2s ease-in-out infinite",
          }}
        >
          ZoškaGram
        </Typography>
        <Box sx={{ position: "relative" }}>
          <CircularProgress
            size={48}
            thickness={4}
            sx={{
              color: theme.palette.primary.main,
              animation: "spin 1.5s linear infinite",
            }}
          />
          <CircularProgress
            size={48}
            thickness={4}
            sx={{
              position: "absolute",
              left: 0,
              color: theme.palette.secondary.main,
              opacity: 0.5,
              animation: "spin 2s linear infinite reverse",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default LoadingScreen; 