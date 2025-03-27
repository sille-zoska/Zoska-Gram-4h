// src/components/ThemeProvider.tsx

"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ThemeProvider as MUIThemeProvider, CssBaseline, GlobalStyles } from "@mui/material";
import { darkTheme, lightTheme } from "../styles/theme";

interface ThemeContextType {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  toggleTheme: () => {},
  isDarkMode: false,
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
    }
  }, []);

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
              transition: 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
            },
            body: {
              minHeight: '100vh',
              background: isDarkMode ? '#121212' : '#F8F9FA',
            },
            'img': {
              maxWidth: '100%',
              height: 'auto',
              borderRadius: '8px',
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
            '::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '::-webkit-scrollbar-track': {
              background: isDarkMode ? '#1E1E1E' : '#F1F1F1',
              borderRadius: '4px',
            },
            '::-webkit-scrollbar-thumb': {
              background: isDarkMode ? '#888' : '#888',
              borderRadius: '4px',
              '&:hover': {
                background: isDarkMode ? '#555' : '#555',
              },
            },
            '.gradient-text': {
              background: 'linear-gradient(45deg, #FF385C, #1DA1F2)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              fontWeight: 700,
            },
            '.hover-scale': {
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            },
            '.glass-effect': {
              background: isDarkMode 
                ? 'rgba(30, 30, 30, 0.8)' 
                : 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            },
            '@keyframes float': {
              '0%': {
                transform: 'translateY(0px)',
              },
              '50%': {
                transform: 'translateY(-10px)',
              },
              '100%': {
                transform: 'translateY(0px)',
              },
            },
          }}
        />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
