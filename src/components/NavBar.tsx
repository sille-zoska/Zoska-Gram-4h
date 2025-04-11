// src/components/NavBar.tsx

"use client";

// React imports
import { useState, useEffect } from "react";

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

// Server actions
import { getCurrentUserProfile } from "@/app/actions/profiles";

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
  const [userProfile, setUserProfile] = useState<{avatarUrl?: string | null} | null>(null);

  // Hooks
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toggleTheme, isDarkMode } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

  // Fetch user profile for avatar URL
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (status === "authenticated" && session?.user?.email) {
        try {
          const profile = await getCurrentUserProfile();
          setUserProfile(profile);
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };

    fetchUserProfile();
  }, [session, status]);

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
    if (session?.user?.id) {
      router.push(`/profily/${session.user.id}`);
    }
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
    handleMenuClose();
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
      icon: session?.user ? (
        <Avatar
          src={getAvatarUrl(session.user.name, userProfile?.avatarUrl || session.user.image)}
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
          px: { xs: 1, sm: 2 },
          pb: { xs: 1, sm: 2 },
          zIndex: 1000,
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", sm: "90%", md: "600px" },
            backgroundColor: (theme) => theme.palette.background.paper,
            borderRadius: { xs: '16px 16px 0 0', sm: 10 },  // Flat bottom on mobile
            boxShadow: '0px 4px 20px rgba(0,0,0,0.15)',
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            overflow: "hidden",
            transition: "all 0.3s ease",
            border: (theme) => `1px solid ${theme.palette.divider}`,
            py: { xs: 0.5, sm: 0 },  // Extra padding on mobile for touch
          }}
        >
          <BottomNavigation
            showLabels
            value={value}
            onChange={handleNavigation}
            sx={{
              flexGrow: 1,
              backgroundColor: "transparent",
              height: { xs: 56, sm: 64 },  // Smaller height on mobile
              width: "100%",
              justifyContent: "space-around",
              '& .MuiBottomNavigationAction-root': {
                minWidth: { xs: 'auto', sm: 80 },
                padding: { xs: '6px 8px', sm: '8px 12px' },
                '& .MuiBottomNavigationAction-label': {
                  fontSize: {
                    xs: '0.7rem',
                    sm: '0.75rem'
                  },
                  transition: 'all 0.2s ease',
                  '&.Mui-selected': {
                    fontSize: {
                      xs: '0.75rem',
                      sm: '0.8rem'
                    }
                  }
                },
                '& .MuiSvgIcon-root': {
                  fontSize: {
                    xs: '1.5rem',
                    sm: '1.75rem'
                  }
                },
                '&.Mui-selected': {
                  color: 'primary.main'
                }
              }
            }}
          >
            {navigationPaths.map((path) => (
              <BottomNavigationAction
                key={path.value}
                label={isMobile ? undefined : path.label}
                value={path.value}
                icon={path.icon}
                sx={{
                  minWidth: { xs: 'auto', sm: 80 },
                  '& .MuiBottomNavigationAction-label': {
                    fontSize: '0.75rem',
                    transition: 'all 0.2s ease',
                  },
                  '& .Mui-selected': {
                    color: 'primary.main',
                  },
                  '&.Mui-selected': {
                    transform: { xs: 'translateY(-2px)', sm: 'translateY(-4px)' },
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
                ml: { xs: 0.5, sm: 1 }, 
                mr: { xs: 0.5, sm: 1 },
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
