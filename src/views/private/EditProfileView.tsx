"use client";

// React imports
import { useState, useEffect } from "react";

// Next.js imports
import { useRouter } from "next/navigation";
import Image from "next/image";

// MUI imports
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";

// MUI Icons
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import SaveIcon from "@mui/icons-material/Save";

// Server action import
import { fetchProfilesCursor, type ProfileWithUser } from "@/app/actions/profiles";

export default function EditProfileView() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileWithUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    location: "",
    avatarUrl: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        // TODO: Replace with actual getCurrentUserProfile action
        const { profiles } = await fetchProfilesCursor({ take: 1 });
        if (profiles.length > 0) {
          setProfile(profiles[0]);
          setFormData({
            name: profiles[0].user.name || "",
            bio: profiles[0].bio || "",
            location: profiles[0].location || "",
            avatarUrl: profiles[0].avatarUrl || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement profile update action
    console.log("Updating profile with:", formData);
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography>Načítavam...</Typography>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography>Profil sa nenašiel</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 10 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Upraviť profil
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          {/* Avatar Section */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
            <Box sx={{ position: "relative" }}>
              <Avatar
                src={formData.avatarUrl || undefined}
                sx={{ width: 120, height: 120 }}
              >
                {formData.name?.[0] || "U"}
              </Avatar>
              <IconButton
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  backgroundColor: "background.paper",
                }}
                onClick={() => {
                  // TODO: Implement avatar upload
                  console.log("Upload avatar");
                }}
              >
                <PhotoCameraIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Form Fields */}
          <TextField
            fullWidth
            label="Meno"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            margin="normal"
            multiline
            rows={3}
          />

          <TextField
            fullWidth
            label="Lokalita"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            margin="normal"
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            startIcon={<SaveIcon />}
            sx={{ mt: 3 }}
          >
            Uložiť zmeny
          </Button>
        </Box>
      </Paper>
    </Container>
  );
} 