/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

// React imports
import { useState, useEffect } from "react";
import { useSession } from 'next-auth/react';

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
import Divider from "@mui/material/Divider";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";

// MUI Icons
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import GridViewIcon from "@mui/icons-material/GridView";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Server action import
import { getCurrentUserProfile, updateProfile, createProfile } from "@/app/actions/profiles";

// Types
interface ExtendedUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface Post {
  id: string;
  imageUrl: string;
  caption?: string | null;
}

interface Profile {
  id: string;
  userId: string;
  bio: string | null;
  location: string | null;
  avatarUrl: string | null;
  interests: string[];
  user: {
    name: string | null;
    email: string;
    posts?: Post[];
    followers?: any[];
    following?: any[];
  };
}

type FormData = {
  name: string;
  bio: string;
  location: string;
  avatarUrl: string;
};

type LoadingState = {
  initial: boolean;
  save: boolean;
};

/**
 * EditProfileView Component
 * 
 * Allows users to view and edit their profile information.
 * Features:
 * - View profile information
 * - Edit profile details
 * - Upload avatar image
 * - View user's posts
 * - Display follower/following counts
 */
const EditProfileView = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<LoadingState>({
    initial: true,
    save: false
  });
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isNewProfile, setIsNewProfile] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    bio: "",
    location: "",
    avatarUrl: "",
  });
  const [profile, setProfile] = useState<Profile | null>(null);

  // For displaying interests as a string in the form
  const [interestsString, setInterestsString] = useState('');

  // Effects
  useEffect(() => {
    const loadProfile = async () => {
      if (session?.user?.email) {
        try {
          // Pass the email to fetch profile as a workaround if id is missing
          const userProfile = await getCurrentUserProfile();
          
          if (userProfile) {
            // Existing profile - load its data
            setProfile(userProfile);
            setFormData({
              name: userProfile.user.name || "",
              bio: userProfile.bio || "",
              location: userProfile.location || "",
              avatarUrl: userProfile.avatarUrl || "",
            });
            setInterestsString(userProfile.interests ? userProfile.interests.join(', ') : '');
            setIsNewProfile(false);
          } else {
            // New profile - start with empty form but prefill avatar with user's image
            setFormData({
              name: session.user.name || "",
              bio: "",
              location: "",
              avatarUrl: session.user.image || "",
            });
            setInterestsString('');
            setIsNewProfile(true);
          }
        } catch (error) {
          console.error('Error loading profile:', error);
        } finally {
          setLoading(prev => ({ ...prev, initial: false }));
        }
      }
    };

    loadProfile();
  }, [session]);

  // Validation function
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = "Meno je povinné";
    } else if (formData.name.length > 50) {
      errors.name = "Meno môže mať maximálne 50 znakov";
    }
    
    if (formData.bio.length > 500) {
      errors.bio = "Bio môže mať maximálne 500 znakov";
    }
    
    if (formData.location.length > 100) {
      errors.location = "Lokalita môže mať maximálne 100 znakov";
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Event handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setLoading(prev => ({ ...prev, save: true }));
    setError(null);
    
    try {
      if (isNewProfile) {
        const newProfile = await createProfile(formData);
        setProfile(newProfile);
      } else {
        const updatedProfile = await updateProfile(formData);
        setProfile(updatedProfile);
      }
      
      setSuccess(true);
      setIsEditing(false);
      
      // Refresh the page to update the navigation bar avatar
      router.refresh();
      
      // Add 1.5 second delay then redirect to feed page
      setTimeout(() => {
        router.push('/prispevok');
      }, 1500);
      
    } catch (error) {
      console.error("Failed to save profile:", error);
      setError("Nepodarilo sa uložiť zmeny");
    } finally {
      setLoading(prev => ({ ...prev, save: false }));
    }
  };

  const handleAvatarUpload = () => {
    // TODO: Implement avatar upload
    console.log("Upload avatar");
  };

  // Render functions
  const renderProfileHeader = () => (
    <Box sx={{ display: 'flex', mb: 4 }}>
      <Avatar
        src={formData.avatarUrl || undefined}
        sx={{ width: 100, height: 100, mr: 4 }}
      >
        {formData.name?.[0] || "U"}
      </Avatar>

      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ mr: 2 }}>
            {formData.name || "Neznámy používateľ"}
          </Typography>
          <Button
            variant="contained"
            size="small"
            startIcon={<EditIcon />}
            onClick={() => setIsEditing(true)}
          >
            Upraviť profil
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 4, mb: 2 }}>
          <Typography>
            <strong>{profile?.user.posts?.length || 0}</strong> príspevkov
          </Typography>
          <Typography>
            <strong>{profile?.user.followers?.length || 0}</strong> sledovateľov
          </Typography>
          <Typography>
            <strong>{profile?.user.following?.length || 0}</strong> sledovaných
          </Typography>
        </Box>

        {formData.bio && (
          <Typography variant="body1" sx={{ mb: 1 }}>
            {formData.bio}
          </Typography>
        )}

        {formData.location && (
          <Typography variant="body2" color="text.secondary">
            📍 {formData.location}
          </Typography>
        )}
      </Box>
    </Box>
  );

  const renderPostsGrid = () => (
    <>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <GridViewIcon /> Príspevky
        </Typography>
        
        <ImageList cols={3} gap={2}>
          {(profile?.user.posts || []).map((post: Post) => (
            <ImageListItem 
              key={post.id}
              sx={{ 
                aspectRatio: '1/1',
                cursor: 'pointer',
                '&:hover': { opacity: 0.8 },
                position: 'relative',
              }}
            >
              <Image
                src={post.imageUrl}
                alt={post.caption || ""}
                fill
                sizes="(max-width: 768px) 33vw, 25vw"
                style={{ 
                  objectFit: 'cover',
                }}
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Box>

      {(!profile?.user.posts || profile.user.posts.length === 0) && (
        <Typography 
          align="center" 
          color="text.secondary"
          sx={{ mt: 4 }}
        >
          Zatiaľ žiadne príspevky
        </Typography>
      )}
    </>
  );

  const renderEditForm = () => (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          {isNewProfile ? "Vytvoriť profil" : "Upraviť profil"}
        </Typography>
        {!isNewProfile && (
          <Button
            variant="outlined"
            onClick={() => setIsEditing(false)}
            sx={{ mr: 1 }}
          >
            Zrušiť
          </Button>
        )}
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
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
              onClick={handleAvatarUpload}
            >
              <PhotoCameraIcon />
            </IconButton>
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Meno"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={!!fieldErrors.name}
              helperText={fieldErrors.name}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Bio"
              multiline
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              error={!!fieldErrors.bio}
              helperText={fieldErrors.bio || `${formData.bio.length}/500`}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Lokalita"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              error={!!fieldErrors.location}
              helperText={fieldErrors.location}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading.save}
              startIcon={loading.save ? <CircularProgress size={20} /> : <SaveIcon />}
            >
              {loading.save ? "Ukladá sa..." : isNewProfile ? "Vytvoriť profil" : "Uložiť zmeny"}
            </Button>
          </Grid>
        </Grid>
        
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
    </Paper>
  );

  // Loading and error states
  if (loading.initial) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  // NEW SECTION: Handle new users without a profile
  if (isNewProfile) {
    return (
      <Container sx={{ mt: 4, mb: 10 }}>
        {renderEditForm()}
        
        <Snackbar
          open={success}
          autoHideDuration={6000}
          onClose={() => setSuccess(false)}
        >
          <Alert severity="success">
            Profil bol úspešne vytvorený
          </Alert>
        </Snackbar>
      </Container>
    );
  }

  if (error || !profile) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Typography color="error">{error || "Profil sa nenašiel"}</Typography>
      </Box>
    );
  }

  // Main render
  return (
    <Container sx={{ mt: 4, mb: 10 }}>
      {isEditing ? renderEditForm() : (
        <>
          {renderProfileHeader()}
          {renderPostsGrid()}
        </>
      )}

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success">
          Profil bol úspešne aktualizovaný
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EditProfileView; 