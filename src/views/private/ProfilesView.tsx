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
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExploreIcon from "@mui/icons-material/Explore";

// Server action import
import { fetchProfilesCursor, followUser, unfollowUser, type ProfileWithUser, fetchProfile, fetchUserBookmarks } from "@/app/actions/profiles";

// Add PostImage component import
import PostImageCarousel from "@/components/PostImageCarousel";

// Types
import { LoadingState, Profile, ExtendedUser } from '@/types/common';

// Update Post interface to handle both old and new image structure
interface Post {
  id: string;
  caption: string | null;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  comments?: any[];
  likes?: any[];
  bookmarks?: any[];
  // Support both the old imageUrl field and the new images array
  imageUrl?: string;
  images?: {
    id: string;
    imageUrl: string;
    order: number;
  }[];
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

// Define this interface to be compatible with both old and new data structures
interface BookmarkedPost {
  id: string;
  userId: string;
  caption: string | null;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  // Support both the old imageUrl field and the new images array
  imageUrl?: string;
  images?: {
    id: string;
    imageUrl: string;
    order: number;
  }[];
}

// Update this interface to be compatible with both old and new data structures
interface ProfilePost {
  id: string;
  userId: string;
  caption: string | null;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  // Support both the old imageUrl field and the new images array
  imageUrl?: string;
  images?: {
    id: string;
    imageUrl: string;
    order: number;
  }[];
}

import { getAvatarUrl } from "@/utils/avatar";

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
  const [profileLoading, setProfileLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<BookmarkedPost[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [notification, setNotification] = useState<{
    message: string;
    severity: "success" | "error";
  } | null>(null);
  const [viewMode, setViewMode] = useState<'explore' | 'profile'>('explore');

  // Load all profiles for exploration view
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
        setNotification({
          message: "Nepodarilo sa načítať profily",
          severity: "error"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProfiles();
  }, [searchTerm]);

  // Load current user's profile separately
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!session?.user?.email) {
        setProfileLoading(false);
        return;
      }
      
      try {
        const fetchedProfile = await fetchProfile(session.user.email);
        setUserProfile(fetchedProfile as any);
      } catch (error) {
        console.error('Error loading user profile:', error);
      } finally {
        setProfileLoading(false);
      }
    };

    loadUserProfile();
  }, [session]);

  const handleFollowToggle = async (e: React.MouseEvent, profile: ProfileWithUser) => {
    e.stopPropagation();
    if (!session?.user?.email) return;

    try {
      const updatedProfile = isFollowing(profile)
        ? await unfollowUser(profile.user.id)
        : await followUser(profile.user.id);
      
      // Refresh all profiles to get consistent data
      const { profiles: refreshedProfiles } = await fetchProfilesCursor({
        searchTerm,
      });
      setProfiles(refreshedProfiles);
      
      setNotification({
        message: isFollowing(profile) 
          ? "Používateľ bol odstránený zo sledovaných" 
          : "Používateľ bol pridaný do sledovaných",
        severity: "success"
      });
    } catch (error) {
      console.error("Failed to toggle follow:", error);
      setNotification({
        message: "Nepodarilo sa aktualizovať sledovanie",
        severity: "error"
      });
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
    router.push(`/profily/${profileId}`);
  };

  // Update post navigation
  const handlePostClick = (postId: string) => {
    router.push(`/prispevky/${postId}`);
  };

  const handleSearchClear = () => {
    setSearchTerm("");
  };

  // Load bookmarked posts when viewing bookmarks tab
  const loadBookmarkedPosts = useCallback(async () => {
    if (session?.user?.email) {
      try {
        const bookmarks = await fetchUserBookmarks();
        setBookmarkedPosts(bookmarks as unknown as BookmarkedPost[]);
      } catch (error) {
        console.error("Error loading bookmarked posts:", error);
        setNotification({
          message: "Nepodarilo sa načítať záložky",
          severity: "error"
        });
      }
    }
  }, [session]);

  useEffect(() => {
    if (viewMode === 'profile' && activeTab === 1) {
      loadBookmarkedPosts();
    }
  }, [activeTab, viewMode, loadBookmarkedPosts]);

  // Toggle between explore and profile views
  const toggleViewMode = () => {
    setViewMode(viewMode === 'explore' ? 'profile' : 'explore');
  };

  // Helper function to get the primary image URL from a post
  const getPostImageUrl = (post: any): string => {
    // If the post has the new images array and it's not empty, use the first image
    if (post.images && post.images.length > 0) {
      // Sort by order if multiple images
      const sortedImages = [...post.images].sort((a, b) => a.order - b.order);
      return sortedImages[0].imageUrl;
    }
    // Fall back to the old imageUrl field if it exists
    if (post.imageUrl) {
      return post.imageUrl;
    }
    // Return a placeholder image URL instead of null
    // return "/images/placeholder.jpg";
    // Instead of using a static placeholder.jpg, you could use:
    return `https://api.dicebear.com/7.x/initials/svg?seed=${post.user.name || '?'}&backgroundColor=FF385C,1DA1F2`;
  };

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
          disabled={session?.user?.email === profile.user.email}
          sx={{ mr: 1 }}
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

  // Update the renderRecentPosts function to handle both image structures
  const renderRecentPosts = (profile: ProfileWithUser) => (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Nedávne príspevky
      </Typography>
      {profile.user.posts.length > 0 ? (
        <ImageList cols={3} gap={8}>
          {profile.user.posts.slice(0, 3).map((post: any) => (
            <ImageListItem 
              key={post.id} 
              sx={{ 
                height: '120px', 
                cursor: 'pointer',
                overflow: 'hidden',
                borderRadius: 2
              }}
              onClick={() => handlePostClick(post.id)}
            >
              {post.images && post.images.length > 0 ? (
                <PostImageCarousel 
                  images={post.images}
                  aspectRatio="1/1"
                />
              ) : post.imageUrl ? (
                <Image
                  src={post.imageUrl}
                  alt={post.caption || "Post image"}
                  fill
                  sizes="(max-width: 600px) 33vw, 200px"
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <Box 
                  sx={{ 
                    backgroundColor: 'grey.200', 
                    height: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Žiadny obrázok
                  </Typography>
                </Box>
              )}
            </ImageListItem>
          ))}
        </ImageList>
      ) : (
        <Typography variant="body2" color="text.secondary" align="center">
          Zatiaľ žiadne príspevky
        </Typography>
      )}
    </Box>
  );

  // Update the renderBookmarkedPosts function to handle both image structures
  const renderBookmarkedPosts = () => (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Uložené príspevky
      </Typography>
      {bookmarkedPosts.length > 0 ? (
        <ImageList cols={3} gap={8}>
          {bookmarkedPosts.map((post) => (
            <ImageListItem 
              key={post.id} 
              sx={{ height: '120px', cursor: 'pointer' }}
              onClick={() => handlePostClick(post.id)}
            >
              {post.images && post.images.length > 0 ? (
                // Use the carousel for multiple images
                <PostImageCarousel 
                  images={post.images}
                  aspectRatio="1/1"
                />
              ) : post.imageUrl ? (
                // Use a regular Image component for the old structure
                <Image
                  src={post.imageUrl}
                  alt={post.caption || "Post image"}
                  fill
                  sizes="(max-width: 600px) 33vw, 200px"
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                // No image placeholder
                <Box 
                  sx={{ 
                    backgroundColor: 'grey.200', 
                    height: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Žiadny obrázok
                  </Typography>
                </Box>
              )}
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
    </Box>
  );

  // Main render
  if (isLoading && profiles.length === 0) {
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
            Pre zobrazenie profilov sa musíte prihlásiť.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 10, maxWidth: "md" }}>
      {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">
          {viewMode === 'explore' ? 'Objaviť profily' : 'Môj profil'}
        </Typography>
        <Box>
          <Button 
            onClick={toggleViewMode} 
            startIcon={viewMode === 'explore' ? <AccountCircleIcon /> : <ExploreIcon />}
            variant="outlined"
            sx={{ mr: 1 }}
          >
            {viewMode === 'explore' ? 'Môj profil' : 'Objaviť'}
          </Button>
          {viewMode === 'profile' && (
            <Button 
              component={Link} 
              href="/profily/upravit" 
              variant="contained" 
              startIcon={<EditIcon />}
            >
              Upraviť profil
            </Button>
          )}
        </Box>
      </Box> */}

      {viewMode === 'explore' ? (
        // EXPLORE MODE - Show all profiles
        <>
          {renderSearchBar()}

          {!isLoading && profiles.length === 0 && searchTerm && (
            <Typography align="center" sx={{ my: 4 }} color="text.secondary">
              Žiadne výsledky pre &quot;{searchTerm}&quot;
            </Typography>
          )}

          {profiles.map((profile) => (
            <Card 
              key={profile.id}
              sx={{ 
                mb: 4,
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
              onClick={() => handleProfileClick(profile.id)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Avatar
                    src={getAvatarUrl(profile.user.name, profile.avatarUrl)}
                    alt={profile.user.name || "Používateľ"}
                    sx={{
                      width: 56,
                      height: 56,
                      border: '2px solid white',
                      background: 'linear-gradient(45deg, #FF385C, #1DA1F2)',
                    }}
                  >
                    {profile.user.name?.[0] || "U"}
                  </Avatar>
                  
                  {renderProfileInfo(profile)}
                </Box>

                {renderRecentPosts(profile)}
              </CardContent>
            </Card>
          ))}
        </>
      ) : (
        // PROFILE MODE - Show current user's profile
        profileLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : !userProfile ? (
          <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Profil sa nenašiel
            </Typography>
            <Typography variant="body1" paragraph>
              Vytvorte si svoj profil, aby ste mohli zdieľať viac informácií o sebe.
            </Typography>
            <Button 
              component={Link} 
              href="/profily/upravit" 
              variant="contained" 
              color="primary"
              startIcon={<PersonAddIcon />}
            >
              Vytvoriť profil
            </Button>
          </Paper>
        ) : (
          <>
            {/* User profile card */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Avatar
                    src={getAvatarUrl(userProfile?.user?.name, userProfile.avatarUrl)}
                    alt={userProfile?.user?.name || "Používateľ"}
                    sx={{
                      width: 56,
                      height: 56,
                      border: '2px solid white',
                      background: 'linear-gradient(45deg, #FF385C, #1DA1F2)',
                    }}
                  >
                    {userProfile?.user?.name?.[0] || "U"}
                  </Avatar>
                  
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h5" sx={{ mr: 2 }}>
                        {userProfile.user?.name || "Neznámy používateľ"}
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
                      <Typography variant="body1">
                        <strong>{userProfile.user?.posts?.length || 0}</strong> príspevkov
                      </Typography>
                      <Typography variant="body1">
                        <strong>{userProfile.user?.followers?.length || 0}</strong> sledovateľov
                      </Typography>
                      <Typography variant="body1">
                        <strong>{userProfile.user?.following?.length || 0}</strong> sledovaných
                      </Typography>
                    </Stack>

                    {userProfile.bio && (
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        {userProfile.bio}
                      </Typography>
                    )}
                    
                    {userProfile.location && (
                      <Typography variant="body2" color="text.secondary">
                        📍 {userProfile.location}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>

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
              userProfile?.user?.posts && userProfile.user.posts.length > 0 ? (
                <ImageList cols={3} gap={2}>
                  {userProfile.user.posts.map((post: any) => (
                    <ImageListItem 
                      key={post.id}
                      sx={{ 
                        aspectRatio: '1/1',
                        cursor: 'pointer',
                        '&:hover': { opacity: 0.8 },
                        position: 'relative',
                      }}
                      onClick={() => handlePostClick(post.id)}
                    >
                      <Image
                        src={getPostImageUrl(post) || `https://api.dicebear.com/7.x/initials/svg?seed=${post.user.name || '?'}&backgroundColor=FF385C,1DA1F2`}
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
                {renderBookmarkedPosts()}
              </>
            )}
          </>
        )
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
