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
import FeedPostImageCarousel from "@/components/FeedPostImageCarousel";

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
        // If email is available from session, fetch the user's profile
        if (session.user.email) {
          const fetchedProfile = await fetchProfile(session.user.id || session.user.email);
          if (fetchedProfile) {
            setUserProfile(fetchedProfile as any);
          } else {
            console.error('No profile found for user');
          }
        }
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

  // Helper function to get the appropriate image URL from a post
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
    // Return a placeholder image URL as fallback
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
          height: { xs: '45px', sm: '48px' },
        },
        '& .MuiOutlinedInput-input': {
          fontSize: { xs: '0.875rem', sm: '1rem' },
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
    <Card
      elevation={0}
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 3,
        transition: 'transform 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
        }
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} sm={3} sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: { xs: 'center', sm: 'flex-start' }
        }}>
          <Avatar
            src={getAvatarUrl(profile.user.name, profile.avatarUrl)}
            alt={profile.user.name || "User"}
            sx={{
              width: { xs: 80, sm: 100 },
              height: { xs: 80, sm: 100 },
              mb: 2,
              border: '3px solid white',
              boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
              background: 'linear-gradient(45deg, #FF385C, #1DA1F2)',
            }}
          >
            {profile.user.name?.[0] || "U"}
          </Avatar>
          
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ 
              display: { xs: 'none', sm: 'block' }, 
              mb: 1, 
              fontStyle: 'italic' 
            }}
          >
            {profile.location || "Žiadna lokalita"}
          </Typography>
          
          {session?.user?.email !== profile.user.email && (
            <Button
              variant={isFollowing(profile) ? "outlined" : "contained"}
              size="small"
              startIcon={isFollowing(profile) ? <PersonRemoveIcon /> : <PersonAddIcon />}
              onClick={(e) => handleFollowToggle(e, profile)}
              sx={{ 
                mt: { xs: 0, sm: 2 }, 
                width: { xs: '100%', sm: 'auto' },
                display: { xs: 'none', sm: 'flex' },
                borderRadius: 50,
              }}
            >
              {isFollowing(profile) ? "Nesledovať" : "Sledovať"}
            </Button>
          )}
        </Grid>
        
        <Grid item xs={12} sm={9}>
          <Box sx={{ flexGrow: 1 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' }, 
                gap: { xs: 1, sm: 2 },
                mb: { xs: 2, sm: 1 }
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  lineHeight: { xs: '1.2', sm: '1.4' }
                }}
              >
                {profile.user.name || "Neznámy používateľ"}
              </Typography>
            </Box>

            <Stack 
              direction="row" 
              spacing={{ xs: 2, sm: 3 }} 
              sx={{ 
                mb: 2,
                flexWrap: { xs: 'wrap', sm: 'nowrap' },
                '& .MuiTypography-root': {
                  fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                  minWidth: { xs: 'calc(33.33% - 16px)', sm: 'auto' }
                }
              }}
            >
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
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 1,
                  fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                  lineHeight: { xs: '1.4', sm: '1.5' }
                }}
              >
                {profile.bio}
              </Typography>
            )}
            
            {profile.location && (
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}
              >
                📍 {profile.location}
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Card>
  );

  // Update the renderRecentPosts function for better mobile display
  const renderRecentPosts = (profile: ProfileWithUser) => (
    <Box sx={{ mt: { xs: 2, sm: 4 } }}>
      <Typography 
        variant="h6" 
        sx={{ 
          mb: { xs: 1, sm: 2 },
          fontSize: { xs: '0.9375rem', sm: '1.25rem' }
        }}
      >
        Nedávne príspevky
      </Typography>
      {profile.user.posts.length > 0 ? (
        <ImageList cols={3} gap={2}>
          {profile.user.posts?.map((post: any) => (
            <ImageListItem
              key={post.id}
              sx={{
                aspectRatio: '1/1',
                cursor: 'pointer',
                '&:hover': { opacity: 0.9, transform: 'scale(1.02)' },
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                borderRadius: 2,
                overflow: 'hidden',
              }}
              onClick={() => handlePostClick(post.id)}
            >
              {post.images && post.images.length > 0 ? (
                <FeedPostImageCarousel 
                  images={post.images}
                  aspectRatio="1/1"
                  onImageClick={() => handlePostClick(post.id)}
                />
              ) : (
                <Image
                  src={getPostImageUrl(post)}
                  alt={post.caption || "Post image"}
                  fill
                  sizes="(max-width: 768px) 33vw, 25vw"
                  style={{ objectFit: 'cover' }}
                />
              )}
            </ImageListItem>
          ))}
        </ImageList>
      ) : (
        <Typography 
          variant="body2" 
          color="text.secondary" 
          align="center"
          sx={{
            fontSize: { xs: '0.8125rem', sm: '0.875rem' },
            py: { xs: 2, sm: 3 }
          }}
        >
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
        <Grid container spacing={2}>
          {bookmarkedPosts.map((post) => (
            <Grid item xs={4} key={post.id}>
              <Box
                sx={{
                  position: 'relative',
                  pt: '100%',
                  borderRadius: 2,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
                onClick={() => handlePostClick(post.id)}
              >
                {post.images && post.images.length > 0 ? (
                  <FeedPostImageCarousel 
                    images={post.images}
                    aspectRatio="1/1"
                    onImageClick={() => handlePostClick(post.id)}
                  />
                ) : (
                  <Image
                    src={getPostImageUrl(post)}
                    alt={post.caption || "Post image"}
                    fill
                    sizes="(max-width: 768px) 33vw, 25vw"
                    style={{ objectFit: 'cover' }}
                  />
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
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
    <Container sx={{ 
      mt: { xs: 2, sm: 4 }, 
      mb: { xs: 8, sm: 10 }, 
      maxWidth: "md",
      px: { xs: 1, sm: 2, md: 3 }
    }}>
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

          {/* Add sorting indicator */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              Zoradené od najnovších
            </Typography>
          </Box>

          {profiles.map((profile) => (
            <Card 
              key={profile.id}
              sx={{ 
                mb: { xs: 2, sm: 4 },
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
                borderRadius: { xs: 2, sm: 3 }
              }}
              onClick={() => handleProfileClick(profile.id)}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Box sx={{ 
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  gap: { xs: 2, sm: 3 }
                }}>
                  <Avatar
                    src={getAvatarUrl(profile.user.name, profile.avatarUrl)}
                    alt={profile.user.name || "Používateľ"}
                    sx={{
                      width: { xs: 64, sm: 80 },
                      height: { xs: 64, sm: 80 },
                      border: '2px solid white',
                      background: 'linear-gradient(45deg, #FF385C, #1DA1F2)',
                    }}
                  >
                    {profile.user.name?.[0] || "U"}
                  </Avatar>
                  
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontSize: { xs: '1.1rem', sm: '1.25rem' },
                        mb: 1
                      }}
                    >
                      {profile.user.name || "Neznámy používateľ"}
                    </Typography>

                    <Stack 
                      direction="row" 
                      spacing={{ xs: 2, sm: 3 }} 
                      sx={{ mb: 2 }}
                    >
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
                      <Typography 
                        variant="body2" 
                        sx={{ mb: 1 }}
                      >
                        {profile.bio}
                      </Typography>
                    )}
                    
                    {profile.location && (
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5
                        }}
                      >
                        📍 {profile.location}
                      </Typography>
                    )}

                    {session?.user?.email !== profile.user.email && (
                      <Button
                        variant={isFollowing(profile) ? "outlined" : "contained"}
                        size="small"
                        startIcon={isFollowing(profile) ? <PersonRemoveIcon /> : <PersonAddIcon />}
                        onClick={(e) => handleFollowToggle(e, profile)}
                        sx={{ 
                          mt: 2,
                          borderRadius: 50,
                        }}
                      >
                        {isFollowing(profile) ? "Nesledovať" : "Sledovať"}
                      </Button>
                    )}
                  </Box>
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
                    src={getAvatarUrl(userProfile?.user?.name || '', userProfile?.avatarUrl)}
                    alt={userProfile?.user?.name || "Používateľ"}
                    sx={{
                      width: 100,
                      height: 100,
                      border: '2px solid white',
                      background: 'linear-gradient(45deg, #FF385C, #1DA1F2)',
                    }}
                  >
                    {userProfile?.user?.name?.[0] || 'U'}
                  </Avatar>
                  
                  <Box sx={{ flexGrow: 1, ml: 3 }}>
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
                        borderRadius: 2,
                        overflow: 'hidden',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                      }}
                      onClick={() => handlePostClick(post.id)}
                    >
                      {post.images && post.images.length > 0 ? (
                        <FeedPostImageCarousel 
                          images={post.images}
                          aspectRatio="1/1"
                          onImageClick={() => handlePostClick(post.id)}
                        />
                      ) : (
                        <Image
                          src={getPostImageUrl(post)}
                          alt={post.caption || ""}
                          fill
                          sizes="(max-width: 768px) 33vw, 25vw"
                          style={{ objectFit: 'cover' }}
                        />
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
