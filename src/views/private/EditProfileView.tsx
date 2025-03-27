/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

// React and Next.js imports
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

// MUI imports
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Avatar,
  Paper,
  Divider,
  ImageList,
  ImageListItem,
  Chip,
  IconButton,
  CircularProgress,
  Grid,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";

// MUI Icons
import {
  Save as SaveIcon,
  PhotoCamera as PhotoCameraIcon,
  GridView as GridViewIcon,
  LocationOn as LocationIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
} from "@mui/icons-material";

// Actions
import { getCurrentUserProfile, updateProfile, createProfile } from "@/app/actions/profiles";

// Components 
import PostImageCarousel from "@/components/PostImageCarousel";

// Types
interface ExtendedUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface Post {
  id: string;
  imageUrl?: string;
  caption?: string | null;
  images?: {
    id: string;
    imageUrl: string;
    order: number;
  }[];
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

// Utils
import { getAvatarUrl } from "@/utils/avatar";

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

  // Add ref for file input
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Add uploading state
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);

  // Effects
  useEffect(() => {
    const loadProfile = async () => {
      if (session?.user?.email) {
        try {
          console.log('Loading profile with session:', {
            userName: session.user.name,
            userImage: session.user.image,
            userEmail: session.user.email
          });
          
          const userProfile = await getCurrentUserProfile();
          console.log('Loaded profile:', userProfile);
          
          if (userProfile) {
            setProfile(userProfile);
            console.log('Setting form data with:', {
              name: userProfile.user.name,
              avatarUrl: userProfile.avatarUrl,
              existingProfile: true
            });
            
            setFormData({
              name: userProfile.user.name || "",
              bio: userProfile.bio || "",
              location: userProfile.location || "",
              avatarUrl: userProfile.avatarUrl || "",
            });
            setInterestsString(userProfile.interests ? userProfile.interests.join(', ') : '');
            setIsNewProfile(false);
          } else {
            console.log('Creating new profile with session data:', {
              name: session.user.name,
              image: session.user.image
            });
            
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
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(prev => ({ ...prev, save: true }));

    try {
      if (isNewProfile) {
        // Create new profile
        await createProfile(formData);
      } else {
        // Update existing profile
        await updateProfile(formData);
      }
      setSuccess(true);
      router.push(`/profily/${session?.user?.id}`);
    } catch (error) {
      console.error(`Failed to ${isNewProfile ? 'create' : 'update'} profile:`, error);
      setError(`Nepodarilo sa ${isNewProfile ? 'vytvoriť' : 'aktualizovať'} profil. Skúste to znova neskôr.`);
    } finally {
      setLoading(prev => ({ ...prev, save: false }));
    }
  };

  // Updated handleAvatarUpload to use Vercel Blob
  const handleAvatarUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAvatarFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('Starting avatar upload with file:', {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size
    });

    setIsAvatarUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "avatars");

      console.log('Sending upload request to /api/images');
      const response = await fetch("/api/images", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload avatar");
      }

      const { url: avatarUrl } = await response.json();
      console.log('Received avatar URL from upload:', avatarUrl);

      setFormData(prev => {
        console.log('Updating form data with new avatar URL:', {
          oldUrl: prev.avatarUrl,
          newUrl: avatarUrl
        });
        return {
          ...prev,
          avatarUrl
        };
      });
    } catch (error) {
      console.error("Failed to upload avatar:", error);
      setError(error instanceof Error ? error.message : "Failed to upload avatar");
    } finally {
      setIsAvatarUploading(false);
    }
  };

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
    // return "/images/placeholder.jpg";
    // Instead of using a static placeholder.jpg, you could use:
    return `https://api.dicebear.com/7.x/initials/svg?seed=${formData.name || '?'}&backgroundColor=FF385C,1DA1F2`;
  };

  // Render functions
  const renderProfileHeader = () => {
    console.log('Rendering profile header with:', {
      sessionUserName: session?.user?.name,
      formDataAvatarUrl: formData.avatarUrl,
      profileAvatarUrl: profile?.avatarUrl
    });
    
    return (
      <Box sx={{ display: 'flex', mb: 4 }}>
        <Avatar
          src={getAvatarUrl(session?.user?.name, formData.avatarUrl)}
          alt={session?.user?.name || "Používateľ"}
          sx={{
            width: { xs: 120, sm: 150 },
            height: { xs: 120, sm: 150 },
            border: '4px solid white',
            boxShadow: (theme) => `0 0 20px ${theme.palette.primary.main}15`,
            background: 'linear-gradient(45deg, #FF385C, #1DA1F2)',
          }}
        >
          {session?.user?.name?.[0] || "U"}
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
  };

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
              {post.images && post.images.length > 0 ? (
                // Use PostImageCarousel for multiple images
                <PostImageCarousel 
                  images={post.images}
                  aspectRatio="1/1"
                />
              ) : (
                // Use standard Image for single image
                <Image
                  src={getPostImageUrl(post)}
                  alt={post.caption || ""}
                  fill
                  sizes="(max-width: 768px) 33vw, 25vw"
                  style={{ 
                    objectFit: 'cover',
                  }}
                />
              )}
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

  const renderEditForm = () => {
    console.log('Rendering edit form with:', {
      sessionUserName: session?.user?.name,
      formDataAvatarUrl: formData.avatarUrl,
      isNewProfile
    });
    
    return (
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
                src={getAvatarUrl(session?.user?.name, formData.avatarUrl)}
                alt={session?.user?.name || "Používateľ"}
                sx={{
                  width: 40,
                  height: 40,
                  border: '2px solid white',
                  background: 'linear-gradient(45deg, #FF385C, #1DA1F2)',
                }}
              >
                {session?.user?.name?.[0] || "U"}
              </Avatar>
              <IconButton
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  backgroundColor: "background.paper",
                }}
                onClick={handleAvatarUpload}
                disabled={isAvatarUploading}
              >
                {isAvatarUploading ? (
                  <CircularProgress size={24} />
                ) : (
                  <PhotoCameraIcon />
                )}
              </IconButton>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarFileChange}
                style={{ display: "none" }}
                accept="image/*"
              />
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
  };

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

      <Button
        component={Link}
        href={`/profily/${session?.user?.id}`}
        variant="outlined"
        color="primary"
        startIcon={<ArrowBackIcon />}
      >
        Späť na profil
      </Button>
    </Container>
  );
};

export default EditProfileView; 