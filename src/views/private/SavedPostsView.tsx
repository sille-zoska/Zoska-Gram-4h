"use client";

// React imports
import { useState, useEffect } from "react";

// Next.js imports
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// MUI imports
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Divider,
  CircularProgress,
  ImageList,
  ImageListItem,
  useMediaQuery,
  Alert,
  Button,
  IconButton,
} from "@mui/material";

// MUI icons
import {
  BookmarkBorder as BookmarkBorderIcon,
  GridView as GridViewIcon,
  Info as InfoIcon,
} from "@mui/icons-material";

// Types
import { Post } from "@/types/post";
import { fetchBookmarkedPosts } from "@/app/actions/posts";

// Components
import FeedPostImageCarousel from "@/components/FeedPostImageCarousel";
import { getAvatarUrl } from "@/utils/avatar";

// Helper function to get the appropriate image URL from a post
const getPostImageUrl = (post: Post): string => {
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

/**
 * SavedPostsView Component
 * 
 * Displays a collection of posts that the user has saved/bookmarked.
 * Features:
 * - Grid layout of saved posts
 * - Empty state messaging for users with no saved posts
 * - Click to view full post details
 */
const SavedPostsView = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Check small screens for responsive design
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  
  // Fetch saved posts when component mounts
  useEffect(() => {
    const loadSavedPosts = async () => {
      try {
        setLoading(true);
        const bookmarkedPosts = await fetchBookmarkedPosts();
        setSavedPosts(bookmarkedPosts);
      } catch (err) {
        console.error("Failed to load saved posts:", err);
        setError("Nepodarilo sa načítať uložené príspevky");
      } finally {
        setLoading(false);
      }
    };
    
    if (session?.user) {
      loadSavedPosts();
    }
  }, [session?.user]);
  
  // Handler for post click
  const handlePostClick = (postId: string) => {
    router.push(`/prispevky/${postId}`);
  };
  
  // Loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert 
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => window.location.reload()}>
              Skúsiť znova
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  // Empty state - no saved posts
  if (savedPosts.length === 0) {
    return (
      <Container maxWidth="md" sx={{ mt: 6, mb: 10, textAlign: 'center' }}>
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            justifyContent: 'center',
            py: 8,
          }}
        >
          <BookmarkBorderIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Zatiaľ žiadne uložené príspevky
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Keď si uložíte príspevky, objavia sa tu
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => router.push('/')}
            sx={{ borderRadius: 50, px: 3 }}
          >
            Prehliadať príspevky
          </Button>
        </Box>
      </Container>
    );
  }

  // Main content - grid of saved posts
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 10 }}>
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <BookmarkBorderIcon sx={{ mr: 1 }} color="primary" />
          <Typography variant="h5" fontWeight={600}>
            Uložené príspevky
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={2}>
          {savedPosts.map((post) => (
            <Grid item xs={4} sm={4} md={4} key={post.id}>
              <Box
                sx={{
                  position: 'relative',
                  pt: '100%', // 1:1 Aspect Ratio
                  borderRadius: 2,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  '&:hover': {
                    opacity: 0.8,
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
                    alt={post.caption || 'Saved post image'}
                    fill
                    sizes="(max-width: 600px) 33vw, 25vw"
                    style={{ objectFit: 'cover' }}
                  />
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default SavedPostsView; 