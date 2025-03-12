// src/components/ThemeProvider.tsx

"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ThemeProvider as MUIThemeProvider, CssBaseline, GlobalStyles } from "@mui/material";
import { darkTheme, lightTheme } from "../styles/theme";

// Create a context for the theme
const ThemeContext = createContext({
  toggleTheme: () => {},
  isDarkMode: false,
});

// Export a custom hook for easy access to theme context
export const useTheme = () => useContext(ThemeContext);

// ThemeProvider component
const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load theme preference from localStorage
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
    }
  }, []);

  // Toggle the theme between dark and light
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ toggleTheme, isDarkMode }}>
      <MUIThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        <GlobalStyles
          styles={{
            '*': {
              transition: 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease',
            },
            body: {
              minHeight: '100vh',
            },
            'img': {
              maxWidth: '100%',
              height: 'auto',
            },
            '.fade-enter': {
              opacity: 0,
            },
            '.fade-enter-active': {
              opacity: 1,
              transition: 'opacity 200ms ease-in',
            },
            '.fade-exit': {
              opacity: 1,
            },
            '.fade-exit-active': {
              opacity: 0,
              transition: 'opacity 200ms ease-out',
            },
          }}
        />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
