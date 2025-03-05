// src/views/private/FeedView.tsx

"use client";

// React imports
import { useEffect, useState } from "react";

// Next.js imports
import Image from "next/image";

// MUI imports
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

// MUI Icons
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareIcon from "@mui/icons-material/Share";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";

// Server action import
import { fetchPosts } from "@/app/actions/posts";

// TypeScript interfaces
interface Post {
  id: string;
  userId: string;
  imageUrl: string;
  caption?: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    name: string | null;
  };
}

const FeedView = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts: Post[] = await fetchPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };

    loadPosts();
  }, []);

  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        mt: 4, 
        mb: 10, // Add bottom margin to avoid navbar overlap
        px: { xs: 0 }, // Remove padding on mobile
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
              <Avatar>
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
                <IconButton size="small">
                  <FavoriteIcon />
                </IconButton>
                <IconButton size="small">
                  <ChatBubbleOutlineIcon />
                </IconButton>
                <IconButton size="small">
                  <ShareIcon />
                </IconButton>
              </Box>
              <IconButton size="small">
                <BookmarkBorderIcon />
              </IconButton>
            </Box>
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
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

export default FeedView;

