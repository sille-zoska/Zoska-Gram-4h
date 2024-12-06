// src/components/NavBar.tsx

"use client";

// React imports
import React, { useState } from "react";

// Next.js imports
import { useRouter } from "next/navigation";

// NextAuth imports
import { useSession } from "next-auth/react";

// MUI imports
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import InfoIcon from "@mui/icons-material/Info";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import LoginIcon from "@mui/icons-material/Login";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

// Custom imports
import { useTheme } from "../providers/ThemeProvider";

export default function Navbar() {
  const [value, setValue] = useState("/");
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toggleTheme, isDarkMode } = useTheme(); // Use theme context

  const handleNavigation = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    router.push(newValue);
  };

  // Paths for authenticated users (private paths)
  const privatePaths = [
    { label: "Domov", value: "/", icon: <HomeIcon /> },
    { label: "Hľadať", value: "/hladat", icon: <SearchIcon /> },
    { label: "Pridať", value: "/prispevok", icon: <AddCircleIcon /> },
    {
      label: "Profil",
      value: "/profil",
      icon: session?.user?.image ? (
        <Avatar
          alt={session?.user?.name || "User"}
          src={session?.user?.image || undefined}
        />
      ) : (
        <Avatar>{session?.user?.name?.charAt(0) || "U"}</Avatar>
      ),
    },
    { label: "Odhlásiť", value: "/auth/odhlasenie", icon: <LogoutIcon /> },
  ];

  // Paths for non-authenticated users (public paths)
  const publicPaths = [
    { label: "Domov", value: "/", icon: <HomeIcon /> },
    { label: "O nás", value: "/o-nas", icon: <InfoIcon /> },
    {
      label: "Registrácia",
      value: "/auth/registracia",
      icon: <AppRegistrationIcon />,
    },
    { label: "Prihlásenie", value: "/auth/prihlasenie", icon: <LoginIcon /> },
  ];

  // Select paths based on user authentication status
  const navigationPaths =
    status === "authenticated" ? privatePaths : publicPaths;

  return (
    <Box
      sx={{
        width: "100%",
        position: "fixed",
        bottom: 0,
        backgroundColor: (theme) => theme.palette.background.paper,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between", // Align navigation and toggle properly
        px: 2, // Add padding for better spacing
      }}
    >
      {/* Navigation Section */}
      <BottomNavigation
        showLabels
        value={value}
        onChange={handleNavigation}
        sx={{ flexGrow: 1 }} // Let navigation take most of the width
      >
        {navigationPaths.map((path) => (
          <BottomNavigationAction
            key={path.value}
            label={path.label}
            value={path.value}
            icon={path.icon}
          />
        ))}
      </BottomNavigation>

      {/* Theme Toggle Section */}
      <IconButton
        onClick={toggleTheme}
        sx={{
          color: (theme) => theme.palette.text.primary,
          ml: 2, // Add space between navigation and toggle
        }}
      >
        {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Box>
  );
}
