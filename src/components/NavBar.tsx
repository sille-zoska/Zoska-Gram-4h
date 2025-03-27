// src/components/NavBar.tsx

"use client";

// React imports
import { useState } from "react";

// Next.js imports
import { useRouter } from "next/navigation";

// NextAuth imports
import { useSession } from "next-auth/react";

// MUI Component imports
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
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme as useMuiTheme } from "@mui/material/styles";

// MUI Icon imports
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import InfoIcon from "@mui/icons-material/Info";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import LoginIcon from "@mui/icons-material/Login";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import ExploreIcon from "@mui/icons-material/Explore";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";

// Provider imports
import { useTheme } from "@/providers/ThemeProvider";

// View imports
import SignOutView from "@/views/auth/SignOutView";

// Utility imports
import { getAvatarUrl } from "@/utils/avatar";

// Types
interface NavigationPath {
  label: string;
  value: string;
  icon: JSX.Element;
}

/**
 * NavBar Component
 * 
 * Main navigation component that provides:
 * - Bottom navigation bar for mobile and desktop
 * - Theme toggle functionality
 * - User profile menu
 * - Authentication-aware navigation items
 * - Responsive design with mobile optimizations
 * - Smooth transitions and hover effects
 */
const NavBar = () => {
  // State management
  const [value, setValue] = useState("/");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [signOutDialogOpen, setSignOutDialogOpen] = useState(false);

  // Hooks
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toggleTheme, isDarkMode } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

  // Navigation handlers
  const handleNavigation = (event: React.SyntheticEvent, newValue: string) => {
    if (newValue === "/profil") {
      setAnchorEl(event.currentTarget as HTMLElement);
    } else {
      setValue(newValue);
      router.push(newValue);
    }
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleProfileClick = () => {
    handleMenuClose();
    router.push("/profily/upravit");
  };

  const handleLogoutClick = () => {
    handleMenuClose();
    setSignOutDialogOpen(true);
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const handleSavedPosts = () => {
    handleMenuClose();
    router.push("/prispevky/ulozene");
  };

  const handleProfileSettings = () => {
    router.push("/profily/upravit");
  };

  // Navigation paths configuration
  const privatePaths: NavigationPath[] = [
    { label: "Feed", value: "/prispevky", icon: <HomeIcon /> },
    { label: "Hľadať", value: "/profily", icon: <ExploreIcon /> },
    { label: "Pridať", value: "/prispevky/vytvorit", icon: <AddBoxOutlinedIcon /> },
    {
      label: "Profil",
      value: "/profil",
      icon: session?.user?.image ? (
        <Avatar
          src={getAvatarUrl(session.user.name, session.user.image)}
          alt={session.user.name || "User"}
          sx={{
            width: 32,
            height: 32,
            border: '2px solid white',
            background: 'linear-gradient(45deg, #FF385C, #1DA1F2)',
          }}
        >
          {session.user.name?.[0] || 'U'}
        </Avatar>
      ) : (
        <AccountCircleOutlinedIcon />
      ),
    },
  ];

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
    <>
      <Box
        sx={{
          width: "100%",
          position: "fixed",
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 1,
          pb: 2,
          zIndex: 1000,
        }}
      >
        {/* Navigation Section */}
        <Box
          sx={{
            width: isMobile ? "90%" : "600px",
            backgroundColor: (theme) => theme.palette.background.paper,
            borderRadius: 10,
            boxShadow: '0px 4px 20px rgba(0,0,0,0.15)',
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            overflow: "hidden",
            transition: "all 0.3s ease",
            border: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <BottomNavigation
            showLabels
            value={value}
            onChange={handleNavigation}
            sx={{
              flexGrow: 1,
              backgroundColor: "transparent",
              height: 64,
              width: "100%",
              justifyContent: "space-around",
            }}
          >
            {navigationPaths.map((path) => (
              <BottomNavigationAction
                key={path.value}
                label={isMobile ? undefined : path.label}
                value={path.value}
                icon={path.icon}
                sx={{
                  minWidth: isMobile ? 'auto' : 80,
                  '& .MuiBottomNavigationAction-label': {
                    fontSize: '0.75rem',
                    transition: 'all 0.2s ease',
                  },
                  '& .Mui-selected': {
                    color: 'primary.main',
                  },
                  '&.Mui-selected': {
                    transform: 'translateY(-4px)',
                  },
                  transition: 'all 0.2s ease',
                }}
              />
            ))}
          </BottomNavigation>
          
          {/* Theme Toggle Button for non-authenticated users */}
          {status !== "authenticated" && (
            <IconButton 
              onClick={handleThemeToggle} 
              sx={{ 
                ml: 1, 
                mr: 1,
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                  transform: 'rotate(180deg)',
                },
                transition: 'all 0.3s ease',
              }}
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            borderRadius: 2,
            minWidth: 200,
            mt: 1,
          },
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleProfileClick}>
          <ListItemIcon>
            <AccountCircleOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Môj profil</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={handleSavedPosts}>
          <ListItemIcon>
            <BookmarkBorderIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Uložené príspevky</ListItemText>
        </MenuItem>

        <Divider />
        
        <MenuItem onClick={handleThemeToggle}>
          <ListItemIcon>
            {isDarkMode ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
          </ListItemIcon>
          <ListItemText>{isDarkMode ? "Svetlý režim" : "Tmavý režim"}</ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleLogoutClick}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Odhlásiť sa</ListItemText>
        </MenuItem>
      </Menu>

      {/* Sign Out Dialog */}
      <SignOutView
        open={signOutDialogOpen}
        onClose={() => setSignOutDialogOpen(false)}
      />
    </>
  );
};

export default NavBar;
