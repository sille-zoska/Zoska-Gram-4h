"use client";

// React and Next.js imports
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { sk } from "date-fns/locale";
import { useRouter } from "next/navigation";

// MUI Component imports
import {
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardHeader,
  Avatar,
  Box,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Divider,
  Skeleton,
  CircularProgress,
  Grid,
  Paper,
  CardActions,
  Tooltip,
  Snackbar,
  Alert
} from "@mui/material";

// MUI Icon imports
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ChatBubbleOutline as CommentIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  MoreVert as MoreVertIcon
} from "@mui/icons-material";

// Server actions
import { fetchPosts, createComment, deleteComment, toggleLike, toggleBookmark } from "@/app/actions/posts";

// Types
import { Post, Comment, Bookmark, PostImage } from "@/types/post";
import { User } from "next-auth";

// Import PostImageCarousel component
import PostImageCarousel from "@/components/PostImageCarousel";

// Import FeedPostImageCarousel component
import FeedPostImageCarousel from "@/components/FeedPostImageCarousel";

// Import getAvatarUrl utility
import { getAvatarUrl } from "@/utils/avatar";

// Type for optimistic UI updates
type OptimisticUpdate = {
  id: string;
  type: 'like' | 'unlike' | 'comment' | 'commentDelete' | 'bookmark' | 'unbookmark';
  targetId: string;
  data?: {
    commentId?: string;
    content?: string;
    userId?: string;
  };
};

// Update post type to include user profile
interface UserWithProfile {
  id: string;
  name: string | null;
  email: string;
  image?: string | null;
  profile?: {
    id: string;
    userId: string;
    bio?: string | null;
    avatarUrl?: string | null;
    location?: string | null;
    interests?: string[];
  };
}

interface PostWithUserProfile extends Omit<Post, 'user'> {
  user: UserWithProfile;
}

/**
 * FeedView Component
 * 
 * Displays a feed of posts with likes, comments, and bookmarks functionality.
 * Features:
 * - Like/unlike posts
 * - Add/delete comments
 * - View comments in a dialog
 * - Bookmark/unbookmark posts
 * - Optimistic updates for better UX
 */
const FeedView = () => {
  // Hooks
  const { data: session } = useSession();
  const router = useRouter();
  
  // State
  const [posts, setPosts] = useState<PostWithUserProfile[]>([]);
  const [selectedPost, setSelectedPost] = useState<PostWithUserProfile | null>(null);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Record<string, string>>({});
  const [submittingComment, setSubmittingComment] = useState<Record<string, boolean>>({});
  const [optimisticUpdates, setOptimisticUpdates] = useState<OptimisticUpdate[]>([]);
  const [notification, setNotification] = useState<{
    message: string;
    severity: "success" | "error";
  } | null>(null);

  // Effects
  useEffect(() => {
    loadPosts();
  }, []);

  // Data fetching
  const loadPosts = async () => {
    try {
      setLoading(true);
      const fetchedPosts = await fetchPosts();
      setPosts(fetchedPosts as unknown as PostWithUserProfile[]);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get the primary image URL or handle multiple images
  const getPostImageUrl = (post: PostWithUserProfile): string => {
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
    // return "/images/placeholder.jpg";
    // Instead of using a static placeholder.jpg, you could use:
    return `https://api.dicebear.com/7.x/initials/svg?seed=${post.user.name || '?'}&backgroundColor=FF385C,1DA1F2`;
  };

  // Helper functions
  const isCommentDeleted = (commentId: string) => {
    return optimisticUpdates.some(
      update => update.targetId === commentId && update.type === 'commentDelete'
    );
  };

  const getOptimisticComments = (postId: string, existingComments: Comment[]) => {
    const optimisticComments = optimisticUpdates
      .filter(update => update.targetId === postId && update.type === 'comment')
      .map(update => {
        const now = new Date();
        return {
          id: update.data?.commentId || '',
          content: update.data?.content || '',
          postId,
          createdAt: now,
          updatedAt: now,
          userId: update.data?.userId || '',
          user: {
            id: '',  // We don't have user ID in session
            name: session?.user?.name || '',
            email: session?.user?.email || '',
            image: session?.user?.image || null
          },
          likes: [],  // Empty likes array for new comments
          edited: false,
          parentId: null
        } as Comment;
      });
    
    return [...optimisticComments, ...existingComments];
  };

  // Event handlers
  const handleLikeToggle = async (postId: string) => {
    if (!session?.user) return;
    
    // Check current like state
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    const isCurrentlyLiked = post.likes.some(like => 
      like.user.email === session.user?.email
    );
    
    // Apply optimistic update
    const optimisticId = `${postId}-like-${Date.now()}`;
    
    // Create optimistic update
    setOptimisticUpdates(prev => [
      ...prev,
      { id: optimisticId, type: isCurrentlyLiked ? 'unlike' : 'like', targetId: postId }
    ]);
    
    try {
      // Use the toggle like action
      const updatedPost = await toggleLike(postId);
      
      // Update posts state
      setPosts(prevPosts => 
        prevPosts.map(p => 
          p.id === postId ? { ...updatedPost } as unknown as PostWithUserProfile : p
        )
      );
    } catch (error) {
      console.error(`Failed to toggle like:`, error);
      setNotification({
        message: "Nepodarilo sa pridať/odobrať like",
        severity: "error"
      });
    } finally {
      // Remove optimistic update
      setOptimisticUpdates(prev => prev.filter(update => update.id !== optimisticId));
    }
  };

  // Navigate to user profile
  const navigateToUserProfile = (userId: string | undefined) => {
    if (!userId) return;
    router.push(`/profily/${userId}`);
  };

  // Navigate to post detail
  const navigateToPostDetail = (postId: string) => {
    router.push(`/prispevky/${postId}`);
  };

  const handleBookmarkToggle = async (postId: string) => {
    try {
      const updatedPost = await toggleBookmark(postId);
      // Refresh all posts after bookmark change
      setPosts(prevPosts => prevPosts.map(p => 
        p.id === postId ? { ...updatedPost } as unknown as PostWithUserProfile : p
      ));
    } catch (error) {
      console.error('Error bookmarking post:', error);
      setNotification({
        message: 'Nepodarilo sa pridať/odobrať záložku',
        severity: "error"
      });
    }
  };

  const handleCommentChange = (postId: string, value: string) => {
    setComments(prev => ({ ...prev, [postId]: value }));
  };

  const handleSubmitComment = async (postId: string) => {
    if (!comments[postId]?.trim() || !session?.user) return;
    
    setSubmittingComment(prev => ({ ...prev, [postId]: true }));
    
    // Generate temp ID for optimistic update
    const tempId = `temp-${Date.now()}`;
    const commentText = comments[postId];
    
    // Add optimistic update
    setOptimisticUpdates(prev => [
      ...prev, 
      { 
        id: tempId, 
        type: 'comment', 
        targetId: postId,
        data: { 
          commentId: tempId, 
          content: commentText,
          userId: '' // We don't have user ID in session
        }
      }
    ]);
    
    try {
      const updatedPost = await createComment(postId, commentText);
      
      // Update post with new comments
      setPosts(prevPosts => 
        prevPosts.map(p => 
          p.id === postId ? { ...updatedPost } as unknown as PostWithUserProfile : p
        )
      );
      
      // Clear comment input
      setComments(prev => ({ ...prev, [postId]: '' }));
    } catch (error) {
      console.error("Failed to submit comment:", error);
    } finally {
      setSubmittingComment(prev => ({ ...prev, [postId]: false }));
      // Remove optimistic update
      setOptimisticUpdates(prev => prev.filter(update => update.id !== tempId));
    }
  };

  const handleCommentClick = (post: PostWithUserProfile) => {
    setSelectedPost(post);
    setCommentDialogOpen(true);
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    // Apply optimistic update
    const optimisticId = `${commentId}-delete-${Date.now()}`;
    
    // Find the post to update
    const postToUpdate = posts.find(p => p.id === postId);
    if (!postToUpdate) return;

    // Create optimistically updated post with comment removed
    const updatedComments = postToUpdate.comments.filter(c => c.id !== commentId);
    const optimisticPost = {
      ...postToUpdate,
      comments: updatedComments
    } as unknown as PostWithUserProfile;
    
    // Add to optimistic updates
    setOptimisticUpdates(prev => [
      ...prev,
      { id: optimisticId, type: 'commentDelete', targetId: commentId }
    ]);
    
    // Update UI immediately (for both feed and dialog)
    setPosts(prevPosts => 
      prevPosts.map(p => 
        p.id === postId ? optimisticPost : p
      )
    );
    
    // Update selected post if in dialog
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(optimisticPost);
    }
    
    try {
      // Call deleteComment with just the commentId
      const updatedPost = await deleteComment(commentId);
      
      // Update the posts state with server response
      setPosts(prevPosts => 
        prevPosts.map(p => 
          p.id === postId ? { ...updatedPost } as unknown as PostWithUserProfile : p
        )
      );
      
      // Update selected post if in dialog
      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost({ ...updatedPost } as unknown as PostWithUserProfile);
      }
      
      // Show success notification
      setNotification({
        message: "Komentár bol vymazaný",
        severity: "success"
      });
    } catch (error) {
      console.error("Failed to delete comment:", error);
      // Revert optimistic update on error
      setPosts(prevPosts => {
        const originalPost = posts.find(p => p.id === postId);
        return prevPosts.map(p => p.id === postId && originalPost ? originalPost : p);
      });
      
      // Revert selected post if in dialog
      if (selectedPost && selectedPost.id === postId) {
        const originalPost = posts.find(p => p.id === postId);
        if (originalPost) {
          setSelectedPost(originalPost);
        }
      }
      
      // Show error notification
      setNotification({
        message: "Nepodarilo sa vymazať komentár",
        severity: "error"
      });
    } finally {
      // Remove optimistic update
      setOptimisticUpdates(prev => prev.filter(update => update.id !== optimisticId));
    }
  };

  // UI helper functions
  const hasOptimisticLike = (postId: string) => {
    return optimisticUpdates.some(
      update => update.targetId === postId && (update.type === 'like' || update.type === 'unlike')
    );
  };

  const isLikedByCurrentUser = (post: PostWithUserProfile): boolean => {
    if (!session?.user?.email) return false;
    const baseLikeState = post.likes.some(like => like.user.email === session.user?.email);
    
    // Check for optimistic updates
    const hasLikeUpdate = optimisticUpdates.find(
      update => update.targetId === post.id && (update.type === 'like' || update.type === 'unlike')
    );
    
    if (hasLikeUpdate) {
      return hasLikeUpdate.type === 'like' ? true : false;
    }
    
    return baseLikeState;
  };

  const hasOptimisticBookmark = (postId: string) => {
    return optimisticUpdates.some(
      update => update.targetId === postId && (update.type === 'bookmark' || update.type === 'unbookmark')
    );
  };

  const isBookmarkedByCurrentUser = (post: PostWithUserProfile) => {
    if (!post.bookmarks) return false;
    return post.bookmarks.some(bookmark => 
      bookmark.user?.email === session?.user?.email
    );
  };

  const isBookmarked = (post: PostWithUserProfile): boolean => {
    if (!post.bookmarks) return false;
    return post.bookmarks.some(bookmark => 
      bookmark.user.email === session?.user?.email
    );
  };

  const handleBookmark = async (postId: string): Promise<void> => {
    try {
      const updatedPost = await toggleBookmark(postId);
      // Refresh all posts after bookmark change
      setPosts(prevPosts => prevPosts.map(p => 
        p.id === postId ? { ...updatedPost } as unknown as PostWithUserProfile : p
      ));
    } catch (error) {
      console.error('Error bookmarking post:', error);
      setNotification({
        message: 'Nepodarilo sa pridať/odobrať záložku',
        severity: "error"
      });
    }
  };

  // Helper function to get avatar URL for user
  const getUserAvatarUrl = (user: UserWithProfile): string => {
    // First check if the profile has avatarUrl - prioritize this over OAuth image
    if (user.profile?.avatarUrl) {
      return user.profile.avatarUrl;
    }
    // Fall back to OAuth image if no profile avatar
    if (user.image) {
      return user.image;
    }
    // Return placeholder as last resort
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name || 'U')}&backgroundColor=FF385C,1DA1F2`;
  };

  // Main render
  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        {[1, 2].map((skeleton) => (
          <Paper
            key={skeleton}
            elevation={0}
            sx={{
              mb: 4,
              borderRadius: 3,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <CardHeader
              avatar={<Skeleton variant="circular" width={40} height={40} />}
              title={<Skeleton width="60%" />}
              subheader={<Skeleton width="40%" />}
            />
            <Skeleton variant="rectangular" height={400} />
            <CardContent>
              <Skeleton width="90%" />
              <Skeleton width="60%" />
            </CardContent>
          </Paper>
        ))}
      </Container>
    );
  }

  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        mt: 4, 
        mb: 10,
        px: { xs: 0, sm: 2 },
      }}
    >
      {/* Posts Feed */}
      {posts.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            textAlign: 'center',
            mt: 8,
            p: 4,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            background: 'linear-gradient(to bottom, rgba(255,56,92,0.02), rgba(29,161,242,0.02))',
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #FF385C, #1DA1F2)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Zatiaľ tu nie sú žiadne príspevky
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Začni sledovať spolužiakov alebo pridaj svoj prvý príspevok
          </Typography>
          <Button 
            variant="contained"
            href="/prispevky/vytvorit"
            sx={{
              borderRadius: 50,
              px: 4,
              py: 1.5,
              background: 'linear-gradient(45deg, #FF385C, #1DA1F2)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              '&:hover': {
                background: 'linear-gradient(45deg, #FF385C, #1DA1F2)',
                opacity: 0.9,
              },
            }}
          >
            Pridať príspevok
          </Button>
        </Paper>
      ) : (
        posts.map((post) => {
          const allComments = getOptimisticComments(
            post.id, 
            post.comments.filter(comment => !isCommentDeleted(comment.id))
          );

          return (
            <Paper
              key={post.id}
              elevation={0}
              sx={{
                mb: 4,
                borderRadius: 3,
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <CardHeader
                avatar={
                  <Avatar
                    src={getUserAvatarUrl(post.user)}
                    alt={post.user.name || "Používateľ"}
                    sx={{
                      background: 'linear-gradient(45deg, #FF385C, #1DA1F2)',
                      border: '2px solid white',
                    }}
                  >
                    {post.user.name?.[0] || "U"}
                  </Avatar>
                }
                title={
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 600,
                      cursor: 'pointer',
                      '&:hover': {
                        color: 'primary.main',
                      },
                    }}
                    onClick={() => navigateToUserProfile(post.user.id)}
                  >
                    {post.user.name}
                  </Typography>
                }
                subheader={
                  <Typography variant="caption" color="text.secondary">
                    {formatDistanceToNow(new Date(post.createdAt), { 
                      addSuffix: true, 
                      locale: sk
                    })}
                  </Typography>
                }
              />
              
              {post.images && post.images.length > 0 ? (
                <Box 
                  sx={{ 
                    aspectRatio: '1/1', 
                    position: 'relative'
                  }}
                >
                  <FeedPostImageCarousel 
                    images={post.images}
                    aspectRatio="1/1"
                    onImageClick={() => navigateToPostDetail(post.id)}
                  />
                </Box>
              ) : (
              <CardMedia
                component="img"
                image={getPostImageUrl(post)}
                alt={post.caption || 'Post image'}
                sx={{ 
                  aspectRatio: '1/1',
                  objectFit: 'cover',
                  backgroundColor: '#f0f0f0',
                  cursor: 'pointer'
                }}
                onClick={() => navigateToPostDetail(post.id)}
              />
              )}
              
              <CardActions disableSpacing sx={{ pt: 1, pb: 0 }}>
                <IconButton 
                  onClick={() => handleLikeToggle(post.id)}
                  color={isLikedByCurrentUser(post) ? "primary" : "default"}
                  disabled={hasOptimisticLike(post.id)}
                  sx={{
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  {isLikedByCurrentUser(post) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
                <IconButton 
                  onClick={() => handleCommentClick(post)}
                  sx={{
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      color: 'primary.main',
                    },
                  }}
                >
                  <CommentIcon />
                </IconButton>
                <Box flexGrow={1} />
                <IconButton 
                  onClick={() => handleBookmark(post.id)}
                  sx={{
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  {isBookmarked(post) ? (
                    <BookmarkIcon color="primary" />
                  ) : (
                    <BookmarkBorderIcon />
                  )}
                </IconButton>
              </CardActions>
              
              <CardContent sx={{ pt: 1 }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-block',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                  onClick={() => handleCommentClick(post)}
                >
                  {post.likes.length} To sa páči
                </Typography>
                
                {post.caption && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <Typography 
                      component="span" 
                      sx={{ 
                        fontWeight: 600,
                        mr: 0.5,
                        cursor: 'pointer',
                        '&:hover': {
                          color: 'primary.main',
                        },
                      }}
                      onClick={() => navigateToUserProfile(post.user.id)}
                    >
                      {post.user.name}
                    </Typography>
                    {post.caption}
                  </Typography>
                )}
                
                {allComments.length > 0 && (
                  <Box sx={{ mt: 1.5 }}>
                    {allComments.length > 3 && (
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          mb: 1,
                          cursor: 'pointer',
                          '&:hover': {
                            color: 'primary.main',
                          },
                        }}
                        onClick={() => handleCommentClick(post)}
                      >
                        Zobraziť všetky komentáre ({allComments.length})
                      </Typography>
                    )}
                    
                    {allComments.slice(0, 3).map((comment) => (
                      <Box key={comment.id} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="body2" sx={{ flexGrow: 1 }}>
                          <Typography 
                            component="span" 
                            sx={{ 
                              fontWeight: 600,
                              mr: 0.5,
                              cursor: 'pointer',
                              '&:hover': {
                                color: 'primary.main',
                              },
                            }}
                            onClick={() => navigateToUserProfile(comment.user.id)}
                          >
                            {comment.user.name}
                          </Typography>
                          {comment.content}
                        </Typography>
                        
                        {(comment.user.email === session?.user?.email) && (
                          <Tooltip title="Odstrániť komentár">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteComment(post.id, comment.id)}
                              sx={{ 
                                ml: 1,
                                p: 0.5,
                                '&:hover': {
                                  color: 'error.main',
                                  bgcolor: 'error.lighter',
                                },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    ))}
                  </Box>
                )}
                
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'flex-end' }}>
                  <TextField
                    fullWidth
                    variant="standard"
                    placeholder="Pridať komentár..."
                    size="small"
                    value={comments[post.id] || ''}
                    onChange={(e) => handleCommentChange(post.id, e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmitComment(post.id);
                      }
                    }}
                    InputProps={{
                      disableUnderline: true,
                      sx: { 
                        fontSize: '0.9rem',
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                        borderRadius: 1,
                        px: 1,
                      }
                    }}
                  />
                  
                  {comments[post.id]?.trim() && (
                    <Button
                      sx={{
                        ml: 1,
                        minWidth: 'auto',
                        p: 0,
                        color: 'primary.main',
                        fontWeight: 600,
                        '&:hover': {
                          bgcolor: 'transparent',
                          opacity: 0.8,
                        },
                      }}
                      onClick={() => handleSubmitComment(post.id)}
                      disabled={submittingComment[post.id]}
                    >
                      {submittingComment[post.id] ? (
                        <CircularProgress size={24} />
                      ) : (
                        "Pridať"
                      )}
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Paper>
          );
        })
      )}

      {/* Comments Dialog */}
      <Dialog 
        open={commentDialogOpen} 
        onClose={() => setCommentDialogOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid',
          borderColor: 'divider',
          background: 'linear-gradient(45deg, #FF385C, #1DA1F2)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          fontWeight: 700,
        }}>
          Komentáre
        </DialogTitle>
        <DialogContent>
          {selectedPost && (
            <List sx={{ pt: 2 }}>
              {selectedPost.comments
                .filter(comment => !isCommentDeleted(comment.id))
                .map((comment) => (
                  <ListItem 
                    key={comment.id}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                    secondaryAction={
                      comment.user.email === session?.user?.email && (
                        <IconButton 
                          edge="end" 
                          onClick={() => handleDeleteComment(selectedPost.id, comment.id)}
                          size="small"
                          sx={{
                            '&:hover': {
                              color: 'error.main',
                              bgcolor: 'error.lighter',
                            },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )
                    }
                  >
                    <ListItemAvatar>
                      <Avatar 
                        sx={{
                          background: 'linear-gradient(45deg, #FF385C, #1DA1F2)',
                          border: '2px solid white',
                        }}
                        src={getUserAvatarUrl(comment.user as UserWithProfile)}
                      >
                        {comment.user.name?.[0] || "U"}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography 
                          sx={{ 
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-block',
                            '&:hover': {
                              color: 'primary.main',
                            },
                          }}
                          onClick={() => navigateToUserProfile(comment.user.id)}
                        >
                          {comment.user.name}
                        </Typography>
                      }
                      secondary={comment.content}
                    />
                  </ListItem>
                ))}
            </List>
          )}
        </DialogContent>
        <DialogActions sx={{ 
          flexDirection: 'column',
          p: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
        }}>
          <TextField
            fullWidth
            placeholder="Pridať komentár..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
          <Button 
            fullWidth 
            onClick={() => {
              if (selectedPost && newComment.trim() && session?.user) {
                createComment(selectedPost.id, newComment.trim())
                  .then(updatedPost => {
                    setPosts(prevPosts => 
                      prevPosts.map(p => 
                        p.id === selectedPost.id ? { ...updatedPost } as unknown as PostWithUserProfile : p
                      )
                    );
                    setSelectedPost({ ...updatedPost } as unknown as PostWithUserProfile);
                    setNewComment("");
                  })
                  .catch(error => {
                    console.error("Failed to add comment:", error);
                  });
              }
            }}
            disabled={!newComment.trim() || !selectedPost}
            sx={{ 
              mt: 2,
              borderRadius: 50,
              py: 1,
              background: 'linear-gradient(45deg, #FF385C, #1DA1F2)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(45deg, #FF385C, #1DA1F2)',
                opacity: 0.9,
              },
              '&:disabled': {
                background: 'linear-gradient(45deg, #FF385C, #1DA1F2)',
                opacity: 0.5,
              }
            }}
          >
            Pridať komentár
          </Button>
        </DialogActions>
      </Dialog>

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
          sx={{
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          {notification?.message || ""}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default FeedView;

