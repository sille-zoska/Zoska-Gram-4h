"use client";

// React and Next.js imports
import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

// MUI Component imports
import {
  Container,
  Typography,
  Box,
  Avatar,
  Button,
  Grid,
  Divider,
  ImageList,
  ImageListItem,
  CircularProgress,
  Tabs,
  Tab,
  Skeleton,
  Paper,
  IconButton,
  useMediaQuery,
  useTheme
} from "@mui/material";

// MUI Icon imports
import {
  PersonAdd as PersonAddIcon,
  PersonRemove as PersonRemoveIcon,
  GridView as GridViewIcon,
  Bookmark as BookmarkIcon,
  Settings as SettingsIcon,
  Edit as EditIcon,
  LocationOn as LocationIcon
} from "@mui/icons-material";

// Server actions
import { 
  fetchProfileById, 
  followUser, 
  unfollowUser,
  fetchUserBookmarks
} from "@/app/actions/profiles";

// Components
import PostImageCarousel from "@/components/PostImageCarousel";

// Types
type ProfileDetailViewProps = {
  profileId: string;
};

type PostImage = {
  id: string;
  imageUrl: string;
  order: number;
};

type Post = {
  id: string;
  imageUrl?: string;
  images?: PostImage[];
  caption?: string | null;
  createdAt: Date;
};

type Follow = {
  id: string;
  followerId: string;
};

type User = {
  id: string;
  name: string | null;
  email: string;
  posts: Post[];
  followers: Follow[];
  following: Follow[];
};

type Profile = {
  id: string;
  userId: string;
  bio?: string | null;
  avatarUrl?: string | null;
  location?: string | null;
  interests: string[];
  user: User;
};

type LoadingState = {
  initial: boolean;
  follow: boolean;
};

/**
 * ProfileDetailView Component
 * 
 * Displays detailed information about a user's profile.
 * Features:
 * - View profile information
 * - Follow/unfollow user
 * - View user's posts grid
 * - Display follower/following counts
 */
const ProfileDetailView = ({ profileId }: ProfileDetailViewProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { data: session } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState<LoadingState>({
    initial: true,
    follow: false
  });
  const [error, setError] = useState<string | null>(null);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Post[]>([]);

  // Data fetching
  const loadProfile = useCallback(async () => {
    try {
      const data = await fetchProfileById(profileId);
      setProfile(data);
      
      // Check if current user is following this profile
      if (session?.user?.email) {
        const isCurrentUserFollowing = data.user.followers.some(
          follow => follow.follower.email === session.user?.email
        );
        setIsFollowing(isCurrentUserFollowing);
      }
    } catch (err) {
      setError("Profil sa nepodarilo načítať");
      console.error("Failed to fetch profile:", err);
    } finally {
      setLoading(prev => ({ ...prev, initial: false }));
    }
  }, [profileId, session?.user?.email]);

  const loadBookmarkedPosts = useCallback(async () => {
    if (!session?.user?.email) return;
    
    try {
      const bookmarks = await fetchUserBookmarks();
      setBookmarkedPosts(bookmarks);
    } catch (error) {
      console.error("Error loading bookmarked posts:", error);
    }
  }, [session?.user?.email]);

  useEffect(() => {
    loadProfile();
  }, [profileId, session?.user?.email, loadProfile]);

  useEffect(() => {
    if (activeTab === 1) {
      loadBookmarkedPosts();
    }
  }, [activeTab, loadBookmarkedPosts]);

  // Event handlers
  const handleFollowToggle = async () => {
    if (!profile || !session?.user?.email || loading.follow) return;

    setLoading(prev => ({ ...prev, follow: true }));
    try {
      const updatedProfile = isFollowing
        ? await unfollowUser(profile.user.id)
        : await followUser(profile.user.id);
      
      // Refresh the profile data
      const refreshedProfile = await fetchProfileById(profileId);
      setProfile(refreshedProfile);
      
      // Update following state based on refreshed data
      const newFollowingState = refreshedProfile.user.followers.some(
        follow => follow.follower.email === session.user?.email
      );
      setIsFollowing(newFollowingState);
    } catch (error) {
      console.error("Failed to toggle follow:", error);
    } finally {
      setLoading(prev => ({ ...prev, follow: false }));
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (loading.initial) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Skeleton variant="circular" width={150} height={150} sx={{ mr: 4 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Skeleton variant="text" width="60%" height={40} />
            <Skeleton variant="text" width="40%" height={30} />
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Skeleton variant="rectangular" width={120} height={40} />
              <Skeleton variant="rectangular" width={120} height={40} />
            </Box>
          </Box>
        </Box>
        <Skeleton variant="rectangular" height={50} sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid item xs={4} key={item}>
              <Skeleton variant="rectangular" height={0} sx={{ pt: '100%' }} />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  if (error || !profile) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>
          {error || "Profil sa nepodarilo načítať"}
        </Typography>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Skúsiť znova
        </Button>
      </Container>
    );
  }

  const { user } = profile;
  const isOwnProfile = user.email === session?.user?.email;
  const postsCount = user.posts.length;
  const followersCount = user.followers.length;
  const followingCount = user.following.length;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Profile Header */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 2, md: 4 }, 
          mb: 4, 
          borderRadius: 3,
          background: 'linear-gradient(to bottom, rgba(255,56,92,0.05), rgba(29,161,242,0.05))'
        }}
      >
        <Box 
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'center', md: 'flex-start' },
            gap: { xs: 3, md: 4 }
          }}
        >
          {/* Profile Avatar */}
          <Avatar
            src={profile.avatarUrl || undefined}
            alt={user.name || "User"}
            sx={{
              width: { xs: 120, md: 150 },
              height: { xs: 120, md: 150 },
              border: '4px solid white',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}
          />
          
          {/* Profile Info */}
          <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: { xs: 'center', md: 'flex-start' },
                mb: 2
              }}
            >
              <Typography 
                variant="h4" 
                fontWeight={600}
                sx={{ mr: 2 }}
              >
                {user.name}
              </Typography>
              
              {isOwnProfile ? (
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  href="/profil/upravit"
                  sx={{ 
                    borderRadius: 6,
                    fontSize: { xs: '0.8rem', md: '0.9rem' }
                  }}
                >
                  Upraviť profil
                </Button>
              ) : (
                <Button
                  variant={isFollowing ? "outlined" : "contained"}
                  onClick={handleFollowToggle}
                  disabled={loading.follow}
                  sx={{ 
                    borderRadius: 6,
                    minWidth: 110,
                    fontSize: { xs: '0.8rem', md: '0.9rem' }
                  }}
                >
                  {isFollowing ? "Nesledovať" : "Sledovať"}
                </Button>
              )}
              
              {isOwnProfile && (
                <IconButton sx={{ ml: 1 }}>
                  <SettingsIcon />
                </IconButton>
              )}
            </Box>
            
            {/* Profile Stats */}
            <Box 
              sx={{ 
                display: 'flex', 
                gap: { xs: 3, md: 4 },
                justifyContent: { xs: 'center', md: 'flex-start' },
                mb: 2
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight={600}>
                  {postsCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  príspevkov
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight={600}>
                  {followersCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  sledovateľov
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight={600}>
                  {followingCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  sleduje
                </Typography>
              </Box>
            </Box>
            
            {/* Bio and Location */}
            {profile.bio && (
              <Typography 
                variant="body1" 
                sx={{ 
                  whiteSpace: 'pre-line',
                  textAlign: { xs: 'center', md: 'left' },
                  mt: 1
                }}
              >
                {profile.bio}
              </Typography>
            )}
            
            {profile.location && (
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  mt: 1
                }}
              >
                <LocationIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                <Typography variant="body2" color="text.secondary">
                  {profile.location}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>
      
      {/* Tabs for content filtering */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          centered
        >
          <Tab 
            icon={<GridViewIcon />} 
            label={isMobile ? null : "PRÍSPEVKY"} 
            iconPosition="start"
          />
          <Tab 
            icon={<BookmarkIcon />} 
            label={isMobile ? null : "ULOŽENÉ"} 
            iconPosition="start"
          />
        </Tabs>
      </Box>
      
      {/* Profile Content */}
      {activeTab === 0 && (
        postsCount > 0 ? (
          <Grid container spacing={2}>
            {user.posts.map((post) => (
              <Grid item xs={4} key={post.id}>
                <Box
                  sx={{
                    position: 'relative',
                    pt: '100%', // 1:1 Aspect Ratio
                    borderRadius: 2,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    '&:hover .overlay': {
                      opacity: 1,
                    },
                  }}
                >
                  {post.images && post.images.length > 0 ? (
                    <PostImageCarousel 
                      images={post.images}
                      aspectRatio="1/1" 
                    />
                  ) : post.imageUrl ? (
                    <Image
                      src={post.imageUrl}
                      alt={post.caption || 'Post image'}
                      fill
                      sizes="(max-width: 768px) 33vw, 25vw"
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <Box sx={{ bgcolor: 'grey.200', width: '100%', height: '100%', position: 'absolute' }} />
                  )}
                  <Box
                    className="overlay"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bgcolor: 'rgba(0, 0, 0, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.2s',
                    }}
                  >
                    {/* Likes and Comments count */}
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Zatiaľ tu nie sú žiadne príspevky
            </Typography>
            {isOwnProfile && (
              <Button 
                variant="contained" 
                href="/prispevok/vytvorit"
                sx={{ borderRadius: 50, px: 3 }}
              >
                Pridať prvý príspevok
              </Button>
            )}
          </Box>
        )
      )}
      
      {activeTab === 1 && (
        bookmarkedPosts.length > 0 ? (
          <Grid container spacing={2}>
            {bookmarkedPosts.map((post) => (
              <Grid item xs={4} key={post.id}>
                <Box
                  sx={{
                    position: 'relative',
                    pt: '100%', // 1:1 Aspect Ratio
                    borderRadius: 2,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    '&:hover .overlay': {
                      opacity: 1,
                    },
                  }}
                >
                  {post.images && post.images.length > 0 ? (
                    <PostImageCarousel 
                      images={post.images}
                      aspectRatio="1/1" 
                    />
                  ) : post.imageUrl ? (
                    <Image
                      src={post.imageUrl}
                      alt={post.caption || 'Post image'}
                      fill
                      sizes="(max-width: 768px) 33vw, 25vw"
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <Box sx={{ bgcolor: 'grey.200', width: '100%', height: '100%', position: 'absolute' }} />
                  )}
                  <Box
                    className="overlay"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bgcolor: 'rgba(0, 0, 0, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.2s',
                    }}
                  >
                    {/* Likes and Comments count */}
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Zatiaľ tu nie sú žiadne uložené príspevky
            </Typography>
          </Box>
        )
      )}
    </Container>
  );
};

export default ProfileDetailView; 