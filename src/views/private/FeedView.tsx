// src/views/private/FeedView.tsx

"use client";

// React imports
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

// Next.js imports
import Image from "next/image";

// MUI imports
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";

// MUI Icons
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import DeleteIcon from "@mui/icons-material/Delete";

// Server action import
import { fetchPosts, createComment, deleteComment, toggleLike } from "@/app/actions/posts";
import { Post, Comment } from "@/types/post";

// Feed view component displaying posts
const FeedView = () => {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const fetchedPosts = await fetchPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

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
      await deleteComment(commentId);
      
      // Update local state by removing the deleted comment
      const updatedPost = {
        ...selectedPost,
        comments: selectedPost.comments.filter(comment => comment.id !== commentId)
      };
      
      setPosts(posts.map(post => 
        post.id === selectedPost.id ? updatedPost : post
      ));
      
      // If no comments left, close the dialog
      if (updatedPost.comments.length === 0) {
        setCommentDialogOpen(false);
      }
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const isLikedByCurrentUser = (post: Post) => {
    if (!session?.user?.email) return false;
    return post.likes.some(like => like.user.email === session.user?.email);
  };

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
          {/* Post Header */}
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

          {/* Post Image */}
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

          {/* Post Actions */}
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

            {/* Likes count */}
            {post.likes.length > 0 && (
              <Typography variant="body2" sx={{ fontWeight: 600, mt: 1 }}>
                {post.likes.length} {post.likes.length === 1 ? "like" : "likes"}
              </Typography>
            )}
          </Box>

          {/* Post Content */}
          <CardContent sx={{ pt: 1 }}>
            {post.caption && (
              <Typography variant="body2" sx={{ mb: 1 }}>
                <Box component="span" sx={{ fontWeight: 600, mr: 1 }}>
                  {post.user.name || "Neznámy používateľ"}
                </Box>
                {post.caption}
              </Typography>
            )}

            {/* Comments preview */}
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

      {/* Comments Dialog */}
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

