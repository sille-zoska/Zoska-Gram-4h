// src/components/NavBar.tsx

"use client";

// React imports
import { useState } from "react";

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
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme as useMuiTheme } from "@mui/material/styles";

// MUI Icons
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

// Custom imports
import { useTheme } from "../providers/ThemeProvider";
import SignOutView from "@/views/auth/SignOutView";

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
  const [signOutDialogOpen, setSignOutDialogOpen] = useState(false);
  
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

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
  const handleLogoutClick = () => {
    handleMenuClose();
    setSignOutDialogOpen(true);
  };

  // Handle theme toggle
  const handleThemeToggle = () => {
    toggleTheme();
    // No need to close menu, let user see the theme change immediately
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
    <>
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
          px: 1,
          zIndex: 1000,
          boxShadow: '0px -2px 10px rgba(0,0,0,0.05)',
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
            height: 64,
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
                },
                '& .Mui-selected': {
                  color: 'primary.main',
                },
              }}
            />
          ))}
        </BottomNavigation>
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
        
        <MenuItem onClick={() => {
          handleMenuClose();
          router.push("/ulozene");
        }}>
          <ListItemIcon>
            <BookmarkBorderIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Uložené</ListItemText>
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
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ color: 'error' }}>
            Odhlásiť sa
          </ListItemText>
        </MenuItem>
      </Menu>

      {/* SignOut Dialog */}
      <SignOutView 
        open={signOutDialogOpen}
      />
    </>
  );
};

export default NavBar;
