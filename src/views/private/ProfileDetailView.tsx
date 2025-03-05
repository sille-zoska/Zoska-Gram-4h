"use client";

import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import CircularProgress from "@mui/material/CircularProgress";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GridViewIcon from "@mui/icons-material/GridView";
import { fetchProfileById } from "@/app/actions/profiles";

interface ProfileDetailViewProps {
  profileId: string;
}

interface ProfileWithPosts {
  id: string;
  userId: string;
  bio?: string | null;
  avatarUrl?: string | null;
  location?: string | null;
  interests: string[];
  user: {
    name: string | null;
    email: string;
    posts: {
      id: string;
      imageUrl: string;
      caption?: string | null;
      createdAt: Date;
    }[];
  };
}

const ProfileDetailView = ({ profileId }: ProfileDetailViewProps) => {
  const [profile, setProfile] = useState<ProfileWithPosts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchProfileById(profileId);
        setProfile(data);
      } catch (err) {
        setError("Profil sa nepodarilo načítať");
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [profileId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !profile) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Typography color="error">{error || "Profil sa nenašiel"}</Typography>
      </Box>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 10 }}>
      {/* Profile Header */}
      <Box sx={{ display: 'flex', mb: 4 }}>
        <Avatar
          src={profile.avatarUrl || undefined}
          sx={{ width: 100, height: 100, mr: 4 }}
        >
          {profile.user.name?.[0] || "U"}
        </Avatar>

        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" sx={{ mr: 2 }}>
              {profile.user.name || "Neznámy používateľ"}
            </Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<PersonAddIcon />}
            >
              Sledovať
            </Button>
          </Box>

          <Box sx={{ display: 'flex', gap: 4, mb: 2 }}>
            <Typography>
              <strong>{profile.user.posts.length}</strong> príspevkov
            </Typography>
            <Typography>
              <strong>0</strong> sledovateľov
            </Typography>
            <Typography>
              <strong>0</strong> sledovaných
            </Typography>
          </Box>

          {profile.bio && (
            <Typography variant="body1" sx={{ mb: 1 }}>
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

      {/* Posts Grid */}
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <GridViewIcon /> Príspevky
        </Typography>
        
        <ImageList cols={3} gap={2}>
          {profile.user.posts.map((post) => (
            <ImageListItem 
              key={post.id}
              sx={{ 
                aspectRatio: '1/1',
                cursor: 'pointer',
                '&:hover': { opacity: 0.8 },
              }}
            >
              <img
                src={post.imageUrl}
                alt={post.caption || ""}
                loading="lazy"
                style={{ 
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Box>

      {profile.user.posts.length === 0 && (
        <Typography 
          align="center" 
          color="text.secondary"
          sx={{ mt: 4 }}
        >
          Zatiaľ žiadne príspevky
        </Typography>
      )}
    </Container>
  );
};

export default ProfileDetailView; 