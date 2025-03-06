"use client";

// React imports
import { useEffect, useState } from "react";

// Next.js imports
import { useRouter } from "next/navigation";
import Image from "next/image";

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
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";

// MUI Icons
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import GridViewIcon from "@mui/icons-material/GridView";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

// Server action import
import { fetchProfilesCursor, type ProfileWithUser } from "@/app/actions/profiles";

// Profiles view component displaying user profiles
const ProfilesView = () => {
  const router = useRouter();
  const [profiles, setProfiles] = useState<ProfileWithUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Load profiles on mount and search term change
  useEffect(() => {
    const loadProfiles = async () => {
      setLoading(true);
      try {
        const { profiles: fetchedProfiles } = await fetchProfilesCursor({
          searchTerm,
        });
        setProfiles(fetchedProfiles);
      } catch (error) {
        console.error("Failed to fetch profiles:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfiles();
  }, [searchTerm]);

  // Navigate to profile detail page
  const handleProfileClick = (profileId: string) => {
    router.push(`/profil/${profileId}`);
  };

  return (
    <Container sx={{ mt: 4, mb: 10, maxWidth: "md" }}>
      {/* Search bar */}
      <TextField
        fullWidth
        placeholder="Hľadať používateľov"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            backgroundColor: (theme) => 
              theme.palette.mode === 'dark' ? 'action.hover' : 'grey.100',
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => setSearchTerm("")}>
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Loading indicator */}
      {loading && (
        <Box display="flex" justifyContent="center" mt={2} mb={2}>
          <CircularProgress />
        </Box>
      )}

      {/* No results message */}
      {!loading && profiles.length === 0 && searchTerm && (
        <Typography align="center" sx={{ my: 4 }} color="text.secondary">
          Žiadne výsledky pre &quot;{searchTerm}&quot;
        </Typography>
      )}

      {/* Profile cards */}
      {!loading && profiles.map((profile) => (
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
                    <strong>{profile.user.posts.length}</strong> príspevkov
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
              {profile.user.posts.map((post) => (
                <ImageListItem 
                  key={post.id}
                  sx={{ 
                    aspectRatio: '1/1',
                    position: 'relative',
                    '&:hover': { opacity: 0.8 },
                    overflow: 'hidden',
                  }}
                >
                  <Image
                    src={post.imageUrl}
                    alt={post.caption || ""}
                    fill
                    sizes="(max-width: 600px) 33vw, 200px"
                    style={{ 
                      objectFit: 'cover',
                    }}
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
