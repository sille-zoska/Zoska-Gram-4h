/* eslint-disable @typescript-eslint/no-explicit-any */


"use client";

// React imports
import { useEffect, useState, useCallback } from "react";

// Next.js imports
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Link from "next/link";

// MUI imports
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import { Tab, Tabs } from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { fetchUserBookmarks } from "@/app/actions/profiles";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

// MUI Icons
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import GridViewIcon from "@mui/icons-material/GridView";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";

// Server action import
import { fetchProfilesCursor, followUser, unfollowUser, type ProfileWithUser, fetchProfile } from "@/app/actions/profiles";

// Types
import { LoadingState, Profile, ExtendedUser } from '@/types/common';

// Add Post type definition - must match your existing Post structure
interface Post {
  id: string;
  caption: string | null;
  imageUrl: string;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  comments?: any[];
  likes?: any[];
  bookmarks?: any[];
}

// Remove or rename your local Profile interface to avoid conflict
// For example, rename it to UserProfile
interface UserProfile {
  id: string;
  userId: string;
  bio: string | null;
  location: string | null;
  avatarUrl: string | null;
  interests: string[];
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    name: string | null;
    email: string;
    posts?: any[];
    followers?: any[];
    following?: any[];
  };
}

// Define this interface at the top of your file
interface BookmarkedPost {
  id: string;
  userId: string;
  caption: string | null;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

// Add this interface near your other interfaces
interface ProfilePost {
  id: string;
  userId: string;
  imageUrl: string;
  caption: string | null;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

/**
 * ProfilesView Component
 * 
 * Displays a searchable list of user profiles with follow functionality.
 * Features:
 * - Search users by name
 * - Follow/unfollow users
 * - View user stats (posts, followers, following)
 * - View recent posts grid
 * - Navigate to detailed profile view
 */
const ProfilesView = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [profiles, setProfiles] = useState<ProfileWithUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<BookmarkedPost[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [notification, setNotification] = useState<{
    message: string;
    severity: "success" | "error";
  } | null>(null);

  // Load profiles on mount and search term change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const loadProfiles = async () => {
      setIsLoading(true);
      try {
        const { profiles: fetchedProfiles } = await fetchProfilesCursor({
          searchTerm,
        });
        setProfiles(fetchedProfiles);
      } catch (error) {
        console.error("Failed to fetch profiles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfiles();
  }, [searchTerm]);

  useEffect(() => {
    const loadProfile = async () => {
      if (!session?.user?.email) {
        setIsLoading(false);
        return;
      }
      
      try {
        const userProfile = await fetchProfile(session.user.email);
        setProfile(userProfile as any); // Temporary fix to bypass type checking
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [session]);

  const handleFollowToggle = async (e: React.MouseEvent, profile: ProfileWithUser) => {
    e.stopPropagation();
    if (!session?.user?.email || isLoading) return;

    setIsLoading(true);
    try {
      const updatedProfile = isFollowing(profile)
        ? await unfollowUser(profile.user.id)
        : await followUser(profile.user.id);
      
      // Refresh all profiles to get consistent data
      const { profiles: refreshedProfiles } = await fetchProfilesCursor({
        searchTerm,
      });
      setProfiles(refreshedProfiles);
    } catch (error) {
      console.error("Failed to toggle follow:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFollowing = (profile: ProfileWithUser) => {
    if (!session?.user?.email) return false;
    
    // Check for followers where follower.email matches the current user's email
    return profile.user.followers.some(
      follow => follow.follower.email === session.user?.email
    );
  };

  // Navigate to profile detail page
  const handleProfileClick = (profileId: string) => {
    router.push(`/profil/${profileId}`);
  };

  const handleSearchClear = () => {
    setSearchTerm("");
  };

  // Wrap the loadBookmarkedPosts function with useCallback
  const loadBookmarkedPosts = useCallback(async () => {
    if (session?.user?.email) {
      try {
        const bookmarks = await fetchUserBookmarks();
        setBookmarkedPosts(bookmarks);
      } catch (error) {
        console.error("Error loading bookmarked posts:", error);
        setNotification({
          message: "Nepodarilo sa načítať záložky",
          severity: "error"
        });
      }
    }
  }, [session]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (activeTab === 1) {
      loadBookmarkedPosts();
    }
  }, [activeTab, session]);

  // Render functions
  const renderSearchBar = () => (
    <TextField
      fullWidth
      placeholder="Hľadať používateľov"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      sx={{
        mb: 3,
        '& .MuiOutlinedInput-root': {
          borderRadius: 3,
          backgroundColor: (theme) => 
            theme.palette.mode === 'dark' ? 'action.hover' : 'grey.100',
        },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" />
          </InputAdornment>
        ),
        endAdornment: searchTerm && (
          <InputAdornment position="end">
            <IconButton size="small" onClick={handleSearchClear}>
              <ClearIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );

  const renderProfileInfo = (profile: ProfileWithUser) => (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6" sx={{ mr: 2 }}>
          {profile.user.name || "Neznámy používateľ"}
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={isFollowing(profile) ? <PersonRemoveIcon /> : <PersonAddIcon />}
          onClick={(e) => handleFollowToggle(e, profile)}
          disabled={isLoading || session?.user?.email === profile.user.email}
        >
          {isFollowing(profile) ? "Nesledovať" : "Sledovať"}
        </Button>
      </Box>

      <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
        <Typography variant="body2">
          <strong>{profile.user.posts.length}</strong> príspevkov
        </Typography>
        <Typography variant="body2">
          <strong>{profile.user.followers.length}</strong> sledovateľov
        </Typography>
        <Typography variant="body2">
          <strong>{profile.user.following.length}</strong> sledovaných
        </Typography>
      </Stack>

      {profile.bio && (
        <Typography variant="body2" sx={{ mb: 1 }}>
          {profile.bio}
        </Typography>
      )}
      
      {profile.location && (
        <Typography variant="body2" color="text.secondary">
          📍 {profile.location}
        </Typography>
      )}
    </Box>
  );

  const renderRecentPosts = (profile: ProfileWithUser) => (
    <>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        <GridViewIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Nedávne príspevky
      </Typography>
      <ImageList cols={3} gap={2}>
        {profile.user.posts.map((post: ProfilePost) => (
          <ImageListItem 
            key={post.id}
            sx={{ 
              aspectRatio: '1/1',
              position: 'relative',
              '&:hover': { opacity: 0.8 },
              overflow: 'hidden',
            }}
          >
            <Image
              src={post.imageUrl}
              alt={post.caption || ""}
              fill
              sizes="(max-width: 600px) 33vw, 200px"
              style={{ 
                objectFit: 'cover',
              }}
            />
          </ImageListItem>
        ))}
      </ImageList>
    </>
  );

  // Main render
  if (isLoading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!session) {
    return (
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Prihláste sa
          </Typography>
          <Typography variant="body1">
            Pre zobrazenie profilu sa musíte prihlásiť.
          </Typography>
        </Paper>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Profil sa nenašiel
          </Typography>
          <Typography variant="body1" paragraph>
            Vytvorte si svoj profil, aby ste mohli zdieľať viac informácií o sebe.
          </Typography>
          <Button 
            component={Link} 
            href="/profil/upravit" 
            variant="contained" 
            color="primary"
            startIcon={<PersonAddIcon />}
          >
            Vytvoriť profil
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 10, maxWidth: "md" }}>
      {renderSearchBar()}

      {!isLoading && profiles.length === 0 && searchTerm && (
        <Typography align="center" sx={{ my: 4 }} color="text.secondary">
          Žiadne výsledky pre &quot;{searchTerm}&quot;
        </Typography>
      )}

      {!isLoading && profiles.map((profile) => (
        <Card 
          key={profile.id}
          sx={{ 
            mb: 4,
            cursor: 'pointer',
            boxShadow: 'none',
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
          onClick={() => handleProfileClick(profile.id)}
        >
          <CardContent>
            <Box sx={{ display: 'flex', mb: 3 }}>
              <Avatar
                src={profile.avatarUrl || undefined}
                sx={{ width: 80, height: 80, mr: 3 }}
              >
                {profile.user.name?.[0] || "U"}
              </Avatar>
              
              {renderProfileInfo(profile)}
            </Box>

            {renderRecentPosts(profile)}

            <Stack 
              direction="row" 
              spacing={1} 
              sx={{ mt: 2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <IconButton size="small">
                <FavoriteIcon />
              </IconButton>
              <IconButton size="small">
                <ChatBubbleOutlineIcon />
              </IconButton>
            </Stack>
          </CardContent>
        </Card>
      ))}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button 
          component={Link} 
          href="/profil/upravit" 
          variant="outlined" 
          startIcon={<EditIcon />}
        >
          Upraviť profil
        </Button>
      </Box>

      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        centered
        sx={{ mb: 2 }}
      >
        <Tab icon={<GridViewIcon />} label="Príspevky" />
        <Tab icon={<BookmarkIcon />} label="Záložky" />
      </Tabs>

      {activeTab === 0 ? (
        profile?.user?.posts && profile.user.posts.length > 0 ? (
          <ImageList cols={3} gap={2}>
            {profile.user.posts.map((post: any) => (
              <ImageListItem 
                key={post.id}
                sx={{ 
                  aspectRatio: '1/1',
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.8 },
                  position: 'relative',
                }}
                onClick={() => router.push(`/prispevok/${post.id}`)}
              >
                <Image
                  src={post.imageUrl}
                  alt={post.caption || ""}
                  fill
                  sizes="(max-width: 768px) 33vw, 25vw"
                  style={{ objectFit: 'cover' }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        ) : (
          <Typography 
            align="center" 
            color="text.secondary"
            sx={{ mt: 4 }}
          >
            Zatiaľ žiadne príspevky
          </Typography>
        )
      ) : (
        <>
          {bookmarkedPosts && bookmarkedPosts.length > 0 ? (
            <ImageList cols={3} gap={2}>
              {bookmarkedPosts.map((post: any) => (
                <ImageListItem 
                  key={post.id}
                  sx={{ 
                    aspectRatio: '1/1',
                    cursor: 'pointer',
                    '&:hover': { opacity: 0.8 },
                    position: 'relative',
                  }}
                  onClick={() => router.push(`/prispevok/${post.id}`)}
                >
                  <Image
                    src={post.imageUrl}
                    alt={post.caption || ""}
                    fill
                    sizes="(max-width: 768px) 33vw, 25vw"
                    style={{ objectFit: 'cover' }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          ) : (
            <Typography 
              align="center" 
              color="text.secondary"
              sx={{ mt: 4 }}
            >
              Zatiaľ žiadne záložky
            </Typography>
          )}
        </>
      )}

      <Snackbar
        open={notification !== null}
        autoHideDuration={6000}
        onClose={() => setNotification(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setNotification(null)} 
          severity={notification?.severity || "error"}
          variant="filled"
        >
          {notification?.message || ""}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProfilesView;
