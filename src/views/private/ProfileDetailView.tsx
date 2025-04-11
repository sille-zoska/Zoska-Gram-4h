// src/views/private/ProfileDetailView.tsx

"use client";

// React and Next.js imports
import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
  useTheme,
  Fade,
  Zoom,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
} from "@mui/material";

// MUI Icon imports
import {
  PersonAdd as PersonAddIcon,
  PersonRemove as PersonRemoveIcon,
  GridView as GridViewIcon,
  Bookmark as BookmarkIcon,
  Settings as SettingsIcon,
  Edit as EditIcon,
  LocationOn as LocationIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

// Server actions
import { 
  fetchProfileById, 
  followUser, 
  unfollowUser,
  fetchUserBookmarks
} from "@/app/actions/profiles";
import { deletePost } from "@/app/actions/posts";

// Components
import PostImageCarousel from "@/components/PostImageCarousel";
import FeedPostImageCarousel from "@/components/FeedPostImageCarousel";
import { getAvatarUrl } from "@/utils/avatar";

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
  images?: {
    id: string;
    imageUrl: string;
    order: number;
  }[];
  caption: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  tags: string[];
};

type Follow = {
  id: string;
  createdAt: Date;
  followerId: string;
  followingId: string;
  follower?: {
    id: string;
    name: string | null;
    email: string;
  };
  following?: {
    id: string;
    name: string | null;
    email: string;
  };
};

type User = {
  id: string;
  name: string | null;
  email: string;
  posts: Post[];
  followers: Follow[];
  following: Follow[];
  profile?: {
    id: string;
    avatarUrl: string | null;
  };
};

type Profile = {
  id: string;
  userId: string;
  bio: string | null;
  avatarUrl: string | null;
  location: string | null;
  interests: string[];
  user: User;
  createdAt: Date;
  updatedAt: Date;
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
  const router = useRouter();
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
  
  // Add states for delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    severity: "success" | "error";
  } | null>(null);

  // Data fetching
  const loadProfile = useCallback(async () => {
    try {
      const data = await fetchProfileById(profileId);
      setProfile(data);
      
      // Check if current user is following this profile
      if (session?.user?.email && data?.user?.followers) {
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
      const newFollowingState = refreshedProfile?.user.followers.some(
        follow => follow.follower.email === session.user?.email
      );
      setIsFollowing(newFollowingState ?? false);
    } catch (error) {
      console.error("Failed to toggle follow:", error);
    } finally {
      setLoading(prev => ({ ...prev, follow: false }));
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleEditProfile = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default button behavior
    router.push(`/profily/${profileId}/upravit`);
  };

  const handleDeleteClick = (postId: string) => {
    setPostToDelete(postId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;
    
    setDeleteLoading(true);
    try {
      await deletePost(postToDelete);
      
      // Update local state to remove the deleted post
      if (profile && profile.user.posts) {
        const updatedPosts = profile.user.posts.filter(post => post.id !== postToDelete);
        setProfile({
          ...profile,
          user: {
            ...profile.user,
            posts: updatedPosts
          }
        });
      }
      
      // Also remove from bookmarked posts if present
      setBookmarkedPosts(prev => prev.filter(post => post.id !== postToDelete));
      
      setNotification({
        message: "Príspevok bol úspešne vymazaný",
        severity: "success"
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      setNotification({
        message: "Nepodarilo sa vymazať príspevok",
        severity: "error"
      });
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setPostToDelete(null);
  };

  // Add a navigation handler for posts
  const handlePostClick = (postId: string) => {
    router.push(`/prispevky/${postId}`);
  };

  // Add helper function to get post image URL
  const getPostImageUrl = (post: Post): string => {
    if (post.images && post.images.length > 0) {
      // Sort images by order and get the first one
      const sortedImages = [...post.images].sort((a, b) => a.order - b.order);
      return sortedImages[0].imageUrl;
    }
    // Fallback to legacy imageUrl
    return post.imageUrl || '';
  };

  if (loading.initial) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            background: 'linear-gradient(to bottom, rgba(255,56,92,0.03), rgba(29,161,242,0.03))',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 4 }}>
            <Skeleton 
              variant="circular" 
              width={180} 
              height={180}
              sx={{ 
                bgcolor: 'background.paper',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              }}
            />
            <Box sx={{ flexGrow: 1, width: '100%' }}>
              <Skeleton variant="text" width="60%" height={40} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="40%" height={30} sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', gap: 4, mb: 3 }}>
                <Skeleton variant="rounded" width={100} height={60} />
                <Skeleton variant="rounded" width={100} height={60} />
                <Skeleton variant="rounded" width={100} height={60} />
              </Box>
              <Skeleton variant="text" width="80%" height={24} />
              <Skeleton variant="text" width="70%" height={24} />
            </Box>
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            mt: 4,
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Skeleton variant="rectangular" height={48} />
          <Grid container spacing={2} sx={{ p: 3 }}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Grid item xs={4} key={item}>
                <Skeleton 
                  variant="rounded" 
                  height={0} 
                  sx={{ 
                    pt: '100%',
                    borderRadius: 2,
                    transform: 'scale(1)',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                    },
                  }} 
                />
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    );
  }

  if (error || !profile) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'linear-gradient(to bottom, rgba(255,56,92,0.03), rgba(29,161,242,0.03))',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="h5" gutterBottom>
            {error || "Profil sa nenašiel"}
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {profileId === session?.user?.id 
              ? "Vyzerá to tak, že ešte nemáte vytvorený profil. Vytvorte si ho teraz pre lepšiu interakciu s ostatnými používateľmi."
              : "Vyzerá to tak, že tento používateľ ešte nemá vytvorený profil."}
          </Typography>
          
          {profileId === session?.user?.id && (
            <Button 
              variant="contained" 
              href="/profily/upravit"
              sx={{ 
                mt: 2,
                borderRadius: 50,
                px: 4,
                py: 1,
                background: 'linear-gradient(45deg, #FF385C, #1DA1F2)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #FF385C, #1DA1F2)',
                  opacity: 0.9,
                }
              }}
            >
              Vytvoriť profil
            </Button>
          )}
        </Paper>
      </Container>
    );
  }

  const { user } = profile;
  const isOwnProfile = user.email === session?.user?.email;
  const postsCount = user.posts.length;
  const followersCount = user.followers.length;
  const followingCount = user.following.length;

  return (
    <Container maxWidth="md" sx={{ 
      py: { xs: 2, sm: 4 },
      px: { xs: 1, sm: 2, md: 3 }
    }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 2, sm: 3, md: 4 }, 
          mb: { xs: 2, sm: 4 }, 
          borderRadius: { xs: 2, sm: 3 },
          background: 'linear-gradient(to bottom, rgba(255,56,92,0.03), rgba(29,161,242,0.03))',
          border: '1px solid',
          borderColor: 'divider',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          },
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
          {/* Profile Avatar with gradient border */}
          <Avatar
            src={getAvatarUrl(user.name, profile.avatarUrl)}
            alt={user.name || "Používateľ"}
            sx={{
              width: { xs: 120, md: 180 },
              height: { xs: 120, md: 180 },
              border: '4px solid white',
              boxShadow: (theme) => `0 0 20px ${theme.palette.primary.main}15`,
              background: 'linear-gradient(45deg, #FF385C, #1DA1F2)',
              '& img': {
                border: '4px solid white',
                borderRadius: '50%',
              }
            }}
          >
            {user.name?.[0] || "U"}
          </Avatar>
          
          {/* Profile Info */}
          <Box sx={{ 
            flex: 1, 
            width: '100%',
            textAlign: { xs: 'center', md: 'left' }
          }}>
            {/* Name and Actions */}
            <Box 
              sx={{ 
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { xs: 'center', md: 'flex-start' },
                gap: 2,
                mb: 3
              }}
            >
              <Typography 
                variant="h4" 
                sx={{
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #FF385C, #1DA1F2)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  textAlign: 'center'
                }}
              >
                {user.name || "Neznámy používateľ"}
              </Typography>
              
              {isOwnProfile ? (
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={handleEditProfile}
                  sx={{ 
                    borderRadius: 50,
                    px: 3,
                    py: 1,
                    width: { xs: '100%', md: 'auto' },
                    maxWidth: { xs: '200px', md: 'none' },
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    background: 'linear-gradient(45deg, #FF385C, #1DA1F2)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #FF385C, #1DA1F2)',
                      opacity: 0.9,
                    }
                  }}
                >
                  Upraviť profil
                </Button>
              ) : (
                <Button
                  variant={isFollowing ? "outlined" : "contained"}
                  onClick={handleFollowToggle}
                  disabled={loading.follow}
                  startIcon={isFollowing ? <PersonRemoveIcon /> : <PersonAddIcon />}
                  sx={{ 
                    borderRadius: 50,
                    px: 3,
                    py: 1,
                    width: { xs: '100%', md: 'auto' },
                    maxWidth: { xs: '200px', md: 'none' },
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    ...(isFollowing ? {} : {
                      background: 'linear-gradient(45deg, #FF385C, #1DA1F2)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #FF385C, #1DA1F2)',
                        opacity: 0.9,
                      }
                    })
                  }}
                >
                  {loading.follow ? "Načítavam..." : (isFollowing ? "Nesledovať" : "Sledovať")}
                </Button>
              )}
            </Box>
            
            {/* Stats */}
            <Box 
              sx={{ 
                display: 'flex',
                justifyContent: 'center',
                gap: { xs: 4, md: 6 },
                mb: 3,
                p: 2,
                borderRadius: 2,
                bgcolor: 'background.paper',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" fontWeight={700} color="primary">
                  {postsCount}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  príspevkov
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" fontWeight={700} color="primary">
                  {followersCount}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  sledovateľov
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" fontWeight={700} color="primary">
                  {followingCount}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  sledovaných
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
                  mb: 2,
                  color: 'text.primary',
                  lineHeight: 1.6
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
                  color: 'text.secondary'
                }}
              >
                <LocationIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body2">
                  {profile.location}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>
      
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          },
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              py: 2,
              fontSize: '0.9rem',
              fontWeight: 600,
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: 'action.hover',
              },
              '&.Mui-selected': {
                background: 'linear-gradient(45deg, #FF385C20, #1DA1F220)',
              },
            }
          }}
        >
          <Tooltip title={isMobile ? "Príspevky" : ""}>
            <Tab 
              icon={<GridViewIcon />} 
              label={isMobile ? null : "PRÍSPEVKY"} 
              iconPosition="start"
            />
          </Tooltip>
          <Tooltip title={isMobile ? "Uložené" : ""}>
            <Tab 
              icon={<BookmarkIcon />} 
              label={isMobile ? null : "ULOŽENÉ"} 
              iconPosition="start"
            />
          </Tooltip>
        </Tabs>
        
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          {activeTab === 0 ? (
            postsCount > 0 ? (
              <>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <GridViewIcon /> Príspevky
                  </Typography>
                  
                  <ImageList cols={3} gap={2}>
                    {(profile?.user.posts || []).map((post: Post) => (
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
                        {post.images && post.images.length > 0 ? (
                          <FeedPostImageCarousel 
                            images={post.images}
                            aspectRatio="1/1"
                            onImageClick={() => handlePostClick(post.id)}
                          />
                        ) : (
                          <Image
                            src={post.imageUrl || ""}
                            alt={post.caption || ""}
                            fill
                            sizes="(max-width: 768px) 33vw, 25vw"
                            style={{ 
                              objectFit: 'cover',
                            }}
                          />
                        )}
                        {isOwnProfile && (
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(post.id);
                            }}
                            sx={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              bgcolor: 'rgba(0, 0, 0, 0.5)',
                              color: 'white',
                              '&:hover': {
                                bgcolor: 'rgba(255, 0, 0, 0.7)',
                              },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </ImageListItem>
                    ))}
                  </ImageList>
                </Box>

                {(!profile?.user.posts || profile.user.posts.length === 0) && (
                  <Typography 
                    align="center" 
                    color="text.secondary"
                    sx={{ mt: 4 }}
                  >
                    Zatiaľ žiadne príspevky
                  </Typography>
                )}
              </>
            ) : (
              <Zoom in timeout={500}>
                <Box sx={{ 
                  py: 8, 
                  textAlign: 'center',
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                  },
                }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Zatiaľ tu nie sú žiadne príspevky
                  </Typography>
                  {isOwnProfile && (
                    <Button 
                      variant="contained" 
                      href="/prispevky/vytvorit"
                      sx={{ 
                        mt: 2,
                        borderRadius: 50,
                        px: 4,
                        py: 1,
                        background: 'linear-gradient(45deg, #FF385C, #1DA1F2)',
                        transition: 'all 0.2s',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #FF385C, #1DA1F2)',
                          opacity: 0.9,
                          transform: 'translateY(-2px)',
                        }
                      }}
                    >
                      Pridať prvý príspevok
                    </Button>
                  )}
                </Box>
              </Zoom>
            )
          ) : (
            // Bookmarked posts with similar styling
            <Box sx={{ width: '100%' }}>
              {bookmarkedPosts.length > 0 ? (
                <ImageList cols={3} gap={2}>
                  {bookmarkedPosts.map((post) => (
                    <ImageListItem 
                      key={post.id}
                      sx={{ 
                        aspectRatio: '1/1',
                        cursor: 'pointer',
                        '&:hover': { opacity: 0.8 },
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: 2,
                      }}
                      onClick={() => handlePostClick(post.id)}
                    >
                      {post.images && post.images.length > 0 ? (
                        <FeedPostImageCarousel 
                          images={post.images}
                          aspectRatio="1/1"
                          onImageClick={() => handlePostClick(post.id)}
                          showControls={false}
                        />
                      ) : post.imageUrl ? (
                        <Image
                          src={post.imageUrl}
                          alt={post.caption || "Post image"}
                          fill
                          sizes="(max-width: 768px) 33vw, 25vw"
                          style={{ 
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        <Box 
                          sx={{ 
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'background.paper',
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Žiadny obrázok
                          </Typography>
                        </Box>
                      )}
                    </ImageListItem>
                  ))}
                </ImageList>
              ) : (
                <Box sx={{ 
                  py: 8, 
                  textAlign: 'center',
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                }}>
                  <Typography variant="h6" color="text.secondary">
                    Zatiaľ tu nie sú žiadne uložené príspevky
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Vymazať príspevok?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Naozaj chcete vymazať tento príspevok? Táto akcia sa nedá vrátiť späť.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleDeleteCancel}
            disabled={deleteLoading}
          >
            Zrušiť
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={20} /> : <DeleteIcon />}
          >
            {deleteLoading ? "Vymazávam..." : "Vymazať"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      {notification && (
        <Snackbar
          open={true}
          autoHideDuration={6000}
          onClose={() => setNotification(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setNotification(null)} 
            severity={notification.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      )}
    </Container>
  );
};

export default ProfileDetailView; 