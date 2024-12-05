// src/components/ThemeProvider.tsx

"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ThemeProvider as MUIThemeProvider, CssBaseline } from "@mui/material";
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

  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
    }
  }, []);

  // Toggle the theme between dark and light
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ toggleTheme, isDarkMode }}>
      <MUIThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
