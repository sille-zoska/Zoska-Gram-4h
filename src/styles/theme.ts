// src/styles/theme.ts

import { createTheme } from '@mui/material/styles';

// Base theme shared across modes
const baseTheme = {
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    body1: {
      fontSize: '1rem',
    },
  },
};

// Light theme
const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    primary: { main: '#dc004e' }, // Red
    secondary: { main: '#1976d2' }, // Blue
    background: {
      default: '#f4f6f8', // Light gray
      paper: '#ffffff', // White
    },
    text: {
      primary: '#000000', // Black text in light mode
      secondary: '#555555', // Gray for secondary text
    },
  },
});

// Dark theme
const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: { main: '#f44336' }, // Darker red
    secondary: { main: '#2196f3' }, // Lighter blue
    background: {
      default: '#121212', // Dark background
      paper: '#1e1e1e', // Dark paper
    },
    text: {
      primary: '#ffffff', // White text in dark mode
      secondary: '#aaaaaa', // Light gray for secondary text
    },
  },
});

export { lightTheme, darkTheme };
