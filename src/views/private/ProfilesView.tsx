"use client";

// React imports
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import GridViewIcon from "@mui/icons-material/GridView";

// Server action import
import { fetchProfilesCursor } from "@/app/actions/profiles";

// Define a Profile interface matching your Prisma model
interface Profile {
  id: string;
  userId: string;
  bio?: string | null;
  avatarUrl?: string | null;
  location?: string | null;
  interests: string[];
  user: {
    name: string | null;
    email: string;
  };
}

const ProfilesView = () => {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for posts (we'll replace this with real data later)
  const mockPosts = Array(6).fill(null).map((_, i) => ({
    id: i.toString(),
    imageUrl: `https://source.unsplash.com/random/300x300?sig=${i}`,
  }));

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        const { profiles: fetchedProfiles } = await fetchProfilesCursor({
          take: 10,
          searchTerm,
        });
        setProfiles(fetchedProfiles);
      } catch (error) {
        console.error("Failed to fetch profiles:", error);
      }
    };

    loadProfiles();
  }, [searchTerm]);

  const handleProfileClick = (profileId: string) => {
    router.push(`/profil/${profileId}`);
  };

  return (
    <Container sx={{ mt: 4, mb: 10, maxWidth: "md" }}>
      {profiles.map((profile) => (
        <Card 
          key={profile.id}
          sx={{ 
            mb: 4,
            cursor: 'pointer',
            boxShadow: 'none',
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
          onClick={() => handleProfileClick(profile.id)}
        >
          <CardContent>
            <Box sx={{ display: 'flex', mb: 3 }}>
              {/* Profile Avatar and Info */}
              <Avatar
                src={profile.avatarUrl || undefined}
                sx={{ width: 80, height: 80, mr: 3 }}
              >
                {profile.user.name?.[0] || "U"}
              </Avatar>
              
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" sx={{ mr: 2 }}>
                    {profile.user.name || "Neznámy používateľ"}
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<PersonAddIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add follow functionality later
                    }}
                  >
                    Sledovať
                  </Button>
                </Box>

                <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>42</strong> príspevkov
                  </Typography>
                  <Typography variant="body2">
                    <strong>128</strong> sledovateľov
                  </Typography>
                  <Typography variant="body2">
                    <strong>96</strong> sledovaných
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
            </Box>

            {/* Recent Posts Grid */}
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              <GridViewIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Nedávne príspevky
            </Typography>
            <ImageList cols={3} gap={2}>
              {mockPosts.map((post) => (
                <ImageListItem 
                  key={post.id}
                  sx={{ 
                    aspectRatio: '1/1',
                    '&:hover': { opacity: 0.8 },
                  }}
                >
                  <img
                    src={post.imageUrl}
                    alt=""
                    loading="lazy"
                    style={{ objectFit: 'cover' }}
                  />
                </ImageListItem>
              ))}
            </ImageList>

            {/* Interaction Buttons */}
            <Stack 
              direction="row" 
              spacing={1} 
              sx={{ mt: 2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <IconButton size="small">
                <FavoriteIcon />
              </IconButton>
              <IconButton size="small">
                <ChatBubbleOutlineIcon />
              </IconButton>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

export default ProfilesView;
