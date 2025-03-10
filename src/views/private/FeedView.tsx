// src/views/private/FeedView.tsx

"use client";

// React and Next.js imports
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

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
} from "@mui/material";

// MUI Icon imports
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ChatBubbleOutline as ChatBubbleOutlineIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

// Server actions
import { fetchPosts, createComment, deleteComment, toggleLike } from "@/app/actions/posts";

// Types
import { Post, Comment } from "@/types/post";

// Types for component props and state
type OptimisticUpdate = {
  type: 'like' | 'comment' | 'deleteComment';
  postId: string;
  data: {
    commentId?: string;
    content?: string;
    userId?: string;
  };
};

/**
 * FeedView Component
 * 
 * Displays a feed of posts with likes and comments functionality.
 * Features:
 * - Infinite scrolling post feed
 * - Like/unlike posts
 * - Add/delete comments
 * - View comments in a dialog
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

  // Effects
  useEffect(() => {
    loadPosts();
  }, []);

  // Data fetching
  const loadPosts = async () => {
    try {
      const fetchedPosts = await fetchPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  // Event handlers
  const handleLike = async (postId: string) => {
    try {
      const updatedPost = await toggleLike(postId);
      setPosts(posts.map(post => post.id === postId ? updatedPost : post));
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  const handleCommentClick = (post: Post) => {
    setSelectedPost(post);
    setCommentDialogOpen(true);
  };

  const handleCommentSubmit = async () => {
    if (!selectedPost || !newComment.trim()) return;

    try {
      const updatedPost = await createComment(selectedPost.id, newComment.trim());
      setPosts(posts.map(post => post.id === selectedPost.id ? updatedPost : post));
      setNewComment("");
      setCommentDialogOpen(false);
    } catch (error) {
      console.error("Failed to create comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!selectedPost) return;
    
    try {
      // Optimistic update
      const updatedComments = selectedPost.comments.filter(comment => comment.id !== commentId);
      const optimisticPost = {
        ...selectedPost,
        comments: updatedComments
      };
      
      // Update UI immediately
      setSelectedPost(optimisticPost);
      setPosts(posts.map(post => 
        post.id === selectedPost.id ? optimisticPost : post
      ));
      
      // Close dialog if no comments left
      if (updatedComments.length === 0) {
        setCommentDialogOpen(false);
      }

      // Server update
      const updatedPost = await deleteComment(commentId);
      
      // Sync with server state
      setPosts(posts.map(post => 
        post.id === updatedPost.id ? updatedPost : post
      ));
      setSelectedPost(updatedPost);
    } catch (error) {
      console.error("Failed to delete comment:", error);
      // Revert optimistic update on error
      const originalPost = posts.find(post => post.id === selectedPost.id);
      if (originalPost) {
        setSelectedPost(originalPost);
        setPosts(posts.map(post => 
          post.id === selectedPost.id ? originalPost : post
        ));
      }
    }
  };

  // Helper functions
  const isLikedByCurrentUser = (post: Post): boolean => {
    if (!session?.user?.email) return false;
    return post.likes.some(like => like.user.email === session.user?.email);
  };

  // Render functions
  const renderPostHeader = (post: Post) => (
    <CardHeader
      avatar={
        <Avatar src={post.user.image || undefined}>
          {post.user.name?.[0] || "U"}
        </Avatar>
      }
      title={post.user.name || "Neznámy používateľ"}
      subheader={new Date(post.createdAt).toLocaleDateString('sk-SK')}
      sx={{
        '& .MuiCardHeader-title': {
          fontWeight: 600,
          fontSize: '0.95rem',
        },
        '& .MuiCardHeader-subheader': {
          fontSize: '0.8rem',
        },
      }}
    />
  );

  const renderPostActions = (post: Post) => (
    <Box sx={{ px: 2, pt: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <IconButton 
            size="small"
            onClick={() => handleLike(post.id)}
            sx={{
              color: isLikedByCurrentUser(post) ? 'error.main' : 'action.active',
              '&:hover': {
                color: isLikedByCurrentUser(post) ? 'error.dark' : 'action.active',
              },
            }}
          >
            {isLikedByCurrentUser(post) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          <IconButton 
            size="small"
            onClick={() => handleCommentClick(post)}
          >
            <ChatBubbleOutlineIcon />
          </IconButton>
        </Box>
      </Box>

      {post.likes.length > 0 && (
        <Typography variant="body2" sx={{ fontWeight: 600, mt: 1 }}>
          {post.likes.length} {post.likes.length === 1 ? "like" : "likes"}
        </Typography>
      )}
    </Box>
  );

  // Main render
  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        mt: 4, 
        mb: 10,
        px: { xs: 0 },
      }}
    >
      {posts.map((post) => (
        <Card 
          key={post.id} 
          sx={{ 
            mb: 2,
            boxShadow: 'none',
            borderRadius: 0,
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          {renderPostHeader(post)}

          <CardMedia
            component="img"
            image={post.imageUrl}
            alt={post.caption || "Príspevok bez popisu"}
            sx={{
              width: '100%',
              aspectRatio: '1/1',
              objectFit: 'cover',
            }}
          />

          {renderPostActions(post)}

          <CardContent sx={{ pt: 1 }}>
            {post.caption && (
              <Typography variant="body2" sx={{ mb: 1 }}>
                <Box component="span" sx={{ fontWeight: 600, mr: 1 }}>
                  {post.user.name || "Neznámy používateľ"}
                </Box>
                {post.caption}
              </Typography>
            )}

            {post.comments.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  onClick={() => handleCommentClick(post)}
                  sx={{ cursor: 'pointer' }}
                >
                  Zobraziť všetky komentáre ({post.comments.length})
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      ))}

      <Dialog 
        open={commentDialogOpen} 
        onClose={() => setCommentDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Komentáre</DialogTitle>
        <DialogContent dividers>
          <List>
            {selectedPost?.comments.map((comment: Comment) => (
              <ListItem key={comment.id}>
                <ListItemAvatar>
                  <Avatar src={comment.user.image || undefined}>
                    {comment.user.name?.[0] || "U"}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={comment.user.name}
                  secondary={comment.content}
                />
                {comment.user.email === session?.user?.email && (
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" 
                      onClick={() => handleDeleteComment(comment.id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            ))}
          </List>
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
            onClick={handleCommentSubmit}
            disabled={!newComment.trim()}
            sx={{ mt: 1 }}
          >
            Pridať komentár
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FeedView;

