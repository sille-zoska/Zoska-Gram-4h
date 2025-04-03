"use client";

import { Box, Container, Fade, SxProps, Theme } from "@mui/material";

interface AnimatedLayoutProps {
  children: React.ReactNode;
  containerStyles: SxProps<Theme>;
  contentBoxStyles: SxProps<Theme>;
}

const AnimatedLayout = ({ children, containerStyles, contentBoxStyles }: AnimatedLayoutProps) => {
  return (
    <Fade in timeout={500}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.default",
          position: "relative",
          overflow: "hidden",
          alignItems: "center",
        }}
      >
        {/* Background gradients */}
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "100%",
              background: {
                xs: "none",
                sm: "radial-gradient(circle at top right, rgba(255,56,92,0.15), rgba(29,161,242,0.15))"
              },
              opacity: {
                xs: 1,
                sm: 0.7,
              },
            },
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "100%",
              background: {
                xs: "none",
                sm: "radial-gradient(circle at bottom left, rgba(29,161,242,0.15), rgba(255,56,92,0.15))"
              },
              opacity: {
                xs: 1,
                sm: 0.7,
              },
            },
          }}
        />
        
        {/* Content */}
        <Container
          maxWidth="lg"
          sx={{
            ...containerStyles,
            position: "relative",
            zIndex: 1,
          }}
        >
          <Box sx={{
            ...contentBoxStyles,
            position: "relative",
          }}>
            {children}
          </Box>
        </Container>
      </Box>
    </Fade>
  );
};

export default AnimatedLayout; 