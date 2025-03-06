// src/components/NavBar.tsx

"use client";

// React imports
import { useState } from "react";

// Next.js imports
import { useRouter } from "next/navigation";

// NextAuth imports
import { useSession, signOut } from "next-auth/react";

// MUI imports
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";

// MUI Icons
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import InfoIcon from "@mui/icons-material/Info";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import LoginIcon from "@mui/icons-material/Login";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import ExploreIcon from "@mui/icons-material/Explore";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SettingsIcon from "@mui/icons-material/Settings";

// Custom imports
import { useTheme } from "../providers/ThemeProvider";

// TypeScript interfaces
interface NavigationPath {
  label: string;
  value: string;
  icon: JSX.Element;
}

// Navigation component with theme toggle and profile menu
const NavBar = () => {
  const [value, setValue] = useState("/");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toggleTheme, isDarkMode } = useTheme();

  // Handle navigation and profile menu
  const handleNavigation = (event: React.SyntheticEvent, newValue: string) => {
    if (newValue === "/profil") {
      setAnchorEl(event.currentTarget as HTMLElement);
    } else {
      setValue(newValue);
      router.push(newValue);
    }
  };

  // Close profile menu
  const handleMenuClose = () => setAnchorEl(null);

  // Navigate to profile page
  const handleProfileClick = () => {
    handleMenuClose();
    router.push("/profil/upravit");
  };

  // Handle user logout
  const handleLogout = async () => {
    handleMenuClose();
    await signOut({ callbackUrl: "/" });
  };

  // Paths for authenticated users
  const privatePaths: NavigationPath[] = [
    { label: "Feed", value: "/", icon: <HomeIcon /> },
    { label: "Hľadať", value: "/hladat", icon: <ExploreIcon /> },
    { label: "Pridať", value: "/prispevok/vytvorit", icon: <AddBoxOutlinedIcon /> },
    {
      label: "Profil",
      value: "/profil",
      icon: session?.user?.image ? (
        <Avatar
          sx={{ width: 24, height: 24 }}
          alt={session?.user?.name || "User"}
          src={session?.user?.image || undefined}
        />
      ) : (
        <AccountCircleOutlinedIcon />
      ),
    },
  ];

  // Paths for non-authenticated users
  const publicPaths: NavigationPath[] = [
    { label: "Domov", value: "/", icon: <HomeIcon /> },
    { label: "O nás", value: "/o-nas", icon: <InfoIcon /> },
    {
      label: "Registrácia",
      value: "/auth/registracia",
      icon: <AppRegistrationIcon />,
    },
    { label: "Prihlásenie", value: "/auth/prihlasenie", icon: <LoginIcon /> },
  ];

  // Select paths based on authentication status
  const navigationPaths = status === "authenticated" ? privatePaths : publicPaths;

  return (
    <Box
      sx={{
        width: "100%",
        position: "fixed",
        bottom: 0,
        backgroundColor: (theme) => theme.palette.background.paper,
        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 2,
        zIndex: 1000,
      }}
    >
      {/* Navigation Section */}
      <BottomNavigation
        showLabels
        value={value}
        onChange={handleNavigation}
        sx={{
          flexGrow: 1,
          backgroundColor: "transparent",
        }}
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

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <MenuItem onClick={handleProfileClick}>
          <ListItemIcon>
            <AccountCircleOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Môj profil</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Odhlásiť sa</ListItemText>
        </MenuItem>
      </Menu>

      {/* Theme Toggle Section */}
      <IconButton
        onClick={toggleTheme}
        sx={{
          color: (theme) => theme.palette.text.primary,
          ml: 2,
        }}
      >
        {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Box>
  );
};

export default NavBar;
