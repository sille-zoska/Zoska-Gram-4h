// src/views/private/SearchView.tsx

"use client";

// React imports
import { useState, useEffect } from "react";

// Next.js imports
import { useRouter } from "next/navigation";
import Image from "next/image";

// MUI imports
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Avatar from "@mui/material/Avatar";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

// MUI Icons
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

// Server action import
import { fetchProfilesCursor, ProfileWithUser } from "@/app/actions/profiles";

/**
 * Search view for user profiles,
 * similar to Instagram's search for profiles view.
 */
export default function SearchView() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<ProfileWithUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleProfileClick = (profileId: string) => {
    router.push(`/profil/${profileId}`);
  };

  return (
    <Container sx={{ mt: 4, mb: 10, px: { xs: 2 } }}>
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

      {/* Profile Grid */}
      <ImageList 
        cols={3} 
        gap={2}
        sx={{ 
          mb: 2,
          '& .MuiImageListItem-root': {
            aspectRatio: '1/1',
          },
        }}
      >
        {profiles.map((profile) => (
          <ImageListItem 
            key={profile.id}
            onClick={() => handleProfileClick(profile.id)}
            sx={{ 
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8,
              },
              backgroundColor: 'action.hover',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {profile.avatarUrl ? (
              <Image
                src={profile.avatarUrl}
                alt={profile.user.name || "Profile"}
                fill
                sizes="(max-width: 768px) 33vw, 25vw"
                style={{
                  objectFit: 'cover',
                }}
              />
            ) : (
              <Avatar
                sx={{ 
                  width: '60%',
                  height: '60%',
                }}
              >
                {profile.user.name?.[0] ?? "?"}
              </Avatar>
            )}
          </ImageListItem>
        ))}
      </ImageList>

      {/* Loading indicator */}
      {loading && (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress />
        </Box>
      )}

      {/* No results message */}
      {!loading && profiles.length === 0 && searchTerm && (
        <Typography align="center" sx={{ my: 4 }} color="text.secondary">
          Žiadne výsledky pre &quot;{searchTerm}&quot;
        </Typography>
      )}
    </Container>
  );
}




