"use client";

// React and Next.js imports
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { sk } from "date-fns/locale";

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
import { Post, Comment, Bookmark } from "@/types/post";

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
  
  // State
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
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
        setPosts(fetchedPosts.map(post => ({
          ...post,
          bookmarks: []
        }) as Post));
      } catch (error) {
        console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
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
        prevPosts.map(post => post.id === postId ? {
          ...updatedPost,
          bookmarks: []
        } as Post : post)
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

  const handleBookmarkToggle = async (postId: string) => {
    try {
      await toggleBookmark(postId);
      // Refresh all posts after bookmark change
      loadPosts();
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
        prevPosts.map(post => post.id === postId ? {
          ...updatedPost,
          bookmarks: []
        } as Post : post)
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

  const handleCommentClick = (post: Post) => {
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
      comments: updatedComments,
      bookmarks: []
    } as Post;
    
    // Add to optimistic updates
    setOptimisticUpdates(prev => [
      ...prev,
      { id: optimisticId, type: 'commentDelete', targetId: commentId }
    ]);
    
    // Update UI immediately (for both feed and dialog)
    setPosts(prevPosts => 
      prevPosts.map(post => post.id === postId ? optimisticPost : post)
    );
    
    // Update selected post if in dialog
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost({
        ...selectedPost,
        bookmarks: []
      } as Post);
    }
    
    try {
      const updatedPost = await deleteComment(commentId);
      
      // Update the posts state with server response
      setPosts(prevPosts => 
        prevPosts.map(post => post.id === postId ? {
          ...updatedPost,
          bookmarks: []
        } as Post : post)
      );
      
      // Update selected post if in dialog
      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost({
          ...updatedPost,
          bookmarks: []
        } as Post);
      }
    } catch (error) {
      console.error("Failed to delete comment:", error);
      // Revert optimistic update on error
      setPosts(prevPosts => {
        const originalPost = prevPosts.find(p => p.id === postId);
        return prevPosts.map(post => post.id === postId && originalPost ? originalPost : post);
      });
      
      // Revert selected post if in dialog
      if (selectedPost && selectedPost.id === postId) {
        const originalPost = posts.find(p => p.id === postId);
        if (originalPost) {
          setSelectedPost({
            ...originalPost,
            bookmarks: []
          } as Post);
        }
      }
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

  const isLikedByCurrentUser = (post: Post): boolean => {
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

  const isBookmarkedByCurrentUser = (post: Post) => {
    if (!post.bookmarks) return false;
    return post.bookmarks.some(bookmark => 
      bookmark.user?.email === session?.user?.email
    );
  };

  const isBookmarked = (post: Post): boolean => {
    if (!post.bookmarks) return false;
    return post.bookmarks.some(bookmark => 
      bookmark.user.email === session?.user?.email
    );
  };

  const handleBookmark = async (postId: string): Promise<void> => {
    try {
      await toggleBookmark(postId);
      // Refresh all posts after bookmark change
      loadPosts();
    } catch (error) {
      console.error('Error bookmarking post:', error);
      setNotification({
        message: 'Nepodarilo sa pridať/odobrať záložku',
        severity: "error"
      });
    }
  };

  // Main render
  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        {[1, 2].map((skeleton) => (
          <Card key={skeleton} sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
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
          </Card>
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
        px: { xs: 0 },
      }}
    >
      {/* Posts Feed */}
      {posts.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h5" gutterBottom>
            Zatiaľ tu nie sú žiadne príspevky
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Začni sledovať spolužiakov alebo pridaj svoj prvý príspevok
          </Typography>
          <Button 
            variant="contained" 
            href="/prispevok/vytvorit"
            sx={{ mt: 3, borderRadius: 50, px: 3 }}
          >
            Pridať príspevok
          </Button>
        </Box>
      ) : (
        posts.map((post) => {
          const allComments = getOptimisticComments(
            post.id, 
            post.comments.filter(comment => !isCommentDeleted(comment.id))
          );

          return (
            <Card key={post.id} sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
              <CardHeader
                avatar={
                  <Avatar>
                    {post.user.name?.[0] || 'U'}
                  </Avatar>
                }
                title={
                  <Typography 
                    variant="subtitle1" 
                    sx={{ fontWeight: 600, cursor: 'pointer' }}
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
                action={
                  <IconButton>
                    <MoreVertIcon />
                  </IconButton>
                }
              />
              
              <CardMedia
                component="img"
                image={post.imageUrl}
                alt={post.caption || 'Post image'}
                sx={{ 
                  aspectRatio: '1/1',
                  objectFit: 'cover',
                  backgroundColor: '#f0f0f0',
                }}
              />
              
              <CardActions disableSpacing sx={{ pt: 1, pb: 0 }}>
                <IconButton 
                  onClick={() => handleLikeToggle(post.id)}
                  color={isLikedByCurrentUser(post) ? "primary" : "default"}
                  disabled={hasOptimisticLike(post.id)}
                >
                  {isLikedByCurrentUser(post) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
                <IconButton onClick={() => handleCommentClick(post)}>
                  <CommentIcon />
                </IconButton>
                <IconButton>
                  <SendIcon />
                </IconButton>
                <Box flexGrow={1} />
                <IconButton onClick={() => handleBookmark(post.id)}>
                  {isBookmarked(post) ? (
                    <BookmarkIcon color="primary" />
                  ) : (
                    <BookmarkBorderIcon />
                  )}
                </IconButton>
              </CardActions>
              
              <CardContent sx={{ pt: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {post.likes.length} To sa páči
                </Typography>
                
                {post.caption && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <Typography component="span" fontWeight={600} mr={0.5}>
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
                        sx={{ mb: 1, cursor: 'pointer' }}
                        onClick={() => handleCommentClick(post)}
                      >
                        Zobraziť všetky komentáre ({allComments.length})
                      </Typography>
                    )}
                    
                    {allComments.slice(0, 3).map((comment) => (
                      <Box key={comment.id} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="body2" sx={{ flexGrow: 1 }}>
                          <Typography component="span" fontWeight={600} mr={0.5}>
                            {comment.user.name}
                          </Typography>
                          {comment.content}
                        </Typography>
                        
                        {(comment.user.email === session?.user?.email) && (
                          <Tooltip title="Odstrániť komentár">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteComment(post.id, comment.id)}
                              sx={{ ml: 1, p: 0.5 }}
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
                      sx: { fontSize: '0.9rem' }
                    }}
                  />
                  
                  {comments[post.id]?.trim() && (
                    <Button
                      color="primary"
                      sx={{ ml: 1, minWidth: 'auto', p: 0 }}
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
            </Card>
          );
        })
      )}

      {/* Comments Dialog */}
      <Dialog 
        open={commentDialogOpen} 
        onClose={() => setCommentDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Komentáre</DialogTitle>
        <DialogContent dividers>
          {selectedPost && (
            <List>
              {/* Filter out deleted comments in the dialog view */}
              {selectedPost.comments
                .filter(comment => !isCommentDeleted(comment.id))
                .map((comment) => (
                  <ListItem key={comment.id} 
                    secondaryAction={
                      comment.user.email === session?.user?.email && (
                        <IconButton 
                          edge="end" 
                          onClick={() => handleDeleteComment(selectedPost.id, comment.id)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      )
                    }
                  >
                    <ListItemAvatar>
                      <Avatar>
                        {comment.user.name ? comment.user.name[0] : 'U'}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={comment.user.name}
                      secondary={comment.content}
                    />
                  </ListItem>
                ))}
            </List>
          )}
        </DialogContent>
        <DialogActions sx={{ flexDirection: 'column', p: 2 }}>
          <TextField
            fullWidth
            placeholder="Pridať komentár..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            variant="outlined"
            size="small"
          />
          <Button 
            fullWidth 
            onClick={() => {
              if (selectedPost && newComment.trim() && session?.user) {
                // Directly call the createComment server action
                createComment(selectedPost.id, newComment.trim())
                  .then(updatedPost => {
                    setPosts(prevPosts => 
                      prevPosts.map(post => post.id === selectedPost.id ? {
                        ...updatedPost,
                        bookmarks: []
                      } as Post : post)
                    );
                    setSelectedPost({
                      ...updatedPost,
                      bookmarks: []
                    } as Post);
                    setNewComment("");
                  })
                  .catch(error => {
                    console.error("Failed to add comment:", error);
                  });
              }
            }}
            disabled={!newComment.trim() || !selectedPost}
            sx={{ mt: 1 }}
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
        >
          {notification?.message || ""}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default FeedView;

