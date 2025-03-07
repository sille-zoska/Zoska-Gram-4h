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
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

// MUI Icons
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import SaveIcon from "@mui/icons-material/Save";

// Server action import
import { getCurrentUserProfile, updateProfile, createProfile, type ProfileWithUser } from "@/app/actions/profiles";

export default function EditProfileView() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileWithUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    location: "",
    avatarUrl: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userProfile = await getCurrentUserProfile();
        if (userProfile) {
          setProfile(userProfile);
          setFormData({
            name: userProfile.user.name || "",
            bio: userProfile.bio || "",
            location: userProfile.location || "",
            avatarUrl: userProfile.avatarUrl || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setError("Nepodarilo sa načítať profil");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    try {
      const updatedProfile = profile 
        ? await updateProfile(formData)
        : await createProfile(formData);
        
      setProfile(updatedProfile);
      setSuccess(true);
      // Refresh the page to update the navigation bar avatar
      router.refresh();

      // Wait 1.5 seconds then redirect to feed
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (error) {
      console.error("Failed to save profile:", error);
      setError("Nepodarilo sa uložiť zmeny");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography>Načítavam...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 10 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {profile ? "Upraviť profil" : "Vytvoriť profil"}
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
            required
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
            disabled={saving}
            sx={{ mt: 3 }}
          >
            {saving ? "Ukladám..." : (profile ? "Uložiť zmeny" : "Vytvoriť profil")}
          </Button>
        </Box>
      </Paper>

      {/* Success message */}
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          {profile ? "Zmeny boli úspešne uložené" : "Profil bol úspešne vytvorený"}
        </Alert>
      </Snackbar>

      {/* Error message */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
} 