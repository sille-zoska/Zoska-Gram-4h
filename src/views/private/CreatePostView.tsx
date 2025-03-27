"use client";

// React and Next.js imports
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

// MUI Component imports
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Card,
  CardMedia,
  Alert,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
} from "@mui/material";

// MUI Icon imports
import { 
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from "@mui/icons-material";

// Types
type ImageItem = {
  file: File;
  preview: string;
};

type FormState = {
  caption: string;
  images: ImageItem[];
};

// Add this import
import { createPost } from "@/app/actions/posts";

/**
 * CreatePostView Component
 * 
 * Allows users to create new posts with multiple images and captions.
 * Features:
 * - Multiple image upload with previews (up to 6 images)
 * - Caption input
 * - Form validation
 * - Responsive layout
 */
const CreatePostView = () => {
  // Add session
  const { data: session } = useSession();
  const router = useRouter();
  
  // Add loading and error states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // State
  const [formState, setFormState] = useState<FormState>({
    caption: "",
    images: []
  });

  const MAX_IMAGES = 6;

  // Event handlers
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Convert FileList to array and handle only new files
    const newFiles = Array.from(files);
    const remainingSlots = MAX_IMAGES - formState.images.length;
    
    if (newFiles.length > remainingSlots) {
      setUploadError(`You can only upload up to ${MAX_IMAGES} images. ${remainingSlots} slots remaining.`);
      // Take only the first N files that fit
      newFiles.splice(remainingSlots);
    } else {
      setUploadError(null);
    }

    // Create image items with preview URLs
    const newImageItems = newFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setFormState(prev => ({
      ...prev,
      images: [...prev.images, ...newImageItems]
    }));
  };

  const handleRemoveImage = (index: number) => {
    setFormState(prev => {
      // Clean up the preview URL to prevent memory leaks
      URL.revokeObjectURL(prev.images[index].preview);
      
      const updatedImages = [...prev.images];
      updatedImages.splice(index, 1);
      
      return {
        ...prev,
        images: updatedImages
      };
    });
    
    setUploadError(null);
  };

  const handleCaptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState(prev => ({
      ...prev,
      caption: event.target.value
    }));
  };

  const handleClearAll = () => {
    // Clean up all preview URLs to prevent memory leaks
    formState.images.forEach(image => {
      URL.revokeObjectURL(image.preview);
    });
    
    setFormState(prev => ({
      ...prev,
      images: []
    }));
    
    setUploadError(null);
  };

  // Updated handleSubmit function to handle multiple images
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (formState.images.length === 0 || !session?.user) {
      setUploadError("Please select at least one image");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // Upload all images to Vercel Blob
      const imageUrls = await Promise.all(
        formState.images.map(async (image) => {
          const formData = new FormData();
          formData.append("file", image.file);
          formData.append("folder", "posts");

          const response = await fetch("/api/images", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to upload image");
          }

          return (await response.json()).url;
        })
      );

      // Create the post with all image URLs
      await createPost(formState.caption, imageUrls);
      
      // Clean up all preview URLs
      formState.images.forEach(image => {
        URL.revokeObjectURL(image.preview);
      });
      
      // Redirect to feed after successful creation
      router.push("/prispevky");
    } catch (error) {
      console.error("Failed to create post:", error);
      setUploadError(error instanceof Error ? error.message : "Failed to create post");
    } finally {
      setIsUploading(false);
    }
  };

  // Render functions
  const renderImageGrid = () => (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      {formState.images.map((image, index) => (
        <Grid item xs={6} sm={4} key={index}>
          <Paper
            elevation={0}
            sx={{ 
              position: 'relative',
              borderRadius: 2,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'divider',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.02)',
              },
            }}
          >
            <CardMedia
              component="img"
              image={image.preview}
              alt={`Obrázok ${index + 1}`}
              sx={{ 
                aspectRatio: "1/1", 
                objectFit: "cover",
              }}
            />
            <IconButton
              size="small"
              color="error"
              sx={{ 
                position: 'absolute', 
                top: 8, 
                right: 8,
                backgroundColor: 'rgba(255,255,255,0.9)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,1)',
                  transform: 'scale(1.1)',
                },
                transition: 'transform 0.2s',
              }}
              onClick={() => handleRemoveImage(index)}
              disabled={isUploading}
            >
              <DeleteIcon />
            </IconButton>
          </Paper>
        </Grid>
      ))}
      
      {formState.images.length < MAX_IMAGES && (
        <Grid item xs={6} sm={4}>
          <Paper 
            elevation={0}
            sx={{ 
              aspectRatio: "1/1", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              borderRadius: 2,
              border: '1px dashed',
              borderColor: 'divider',
              background: 'linear-gradient(to bottom, rgba(255,56,92,0.02), rgba(29,161,242,0.02))',
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: 'primary.main',
                background: 'linear-gradient(to bottom, rgba(255,56,92,0.05), rgba(29,161,242,0.05))',
              }
            }}
          >
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              disabled={isUploading}
              sx={{
                borderRadius: 50,
                px: 3,
                py: 1,
                borderColor: 'divider',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'background.paper',
                }
              }}
            >
              Pridať obrázok
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageSelect}
                multiple
              />
            </Button>
          </Paper>
        </Grid>
      )}
    </Grid>
  );

  // Main render
  return (
    <Container sx={{ mt: 4, mb: 8, maxWidth: "sm" }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        mb: 4 
      }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(45deg, #FF385C, #1DA1F2)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            mb: 1,
          }}
        >
          Nový príspevok
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center">
          Zdieľajte svoje najlepšie momenty s ostatnými
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box component="form" onSubmit={handleSubmit}>
          {renderImageGrid()}

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Popis príspevku"
            placeholder="Napíšte niečo o vašom príspevku..."
            value={formState.caption}
            onChange={handleCaptionChange}
            sx={{ 
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />

          {uploadError && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 2
              }}
            >
              {uploadError}
            </Alert>
          )}

          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={formState.images.length === 0 || isUploading}
            sx={{ 
              mb: 2,
              py: 1.5,
              borderRadius: 50,
              background: 'linear-gradient(45deg, #FF385C, #1DA1F2)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              '&:hover': {
                background: 'linear-gradient(45deg, #FF385C, #1DA1F2)',
                opacity: 0.9,
              },
              '&:disabled': {
                background: 'linear-gradient(45deg, #FF385C, #1DA1F2)',
                opacity: 0.5,
              }
            }}
          >
            {isUploading ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1 }} color="inherit" />
                Zdieľam príspevok...
              </>
            ) : (
              "Zdieľať príspevok"
            )}
          </Button>

          {formState.images.length > 0 && (
            <Button
              fullWidth
              variant="outlined"
              color="error"
              onClick={handleClearAll}
              disabled={isUploading}
              sx={{ 
                py: 1.5,
                borderRadius: 50,
                borderColor: 'error.main',
                color: 'error.main',
                '&:hover': {
                  borderColor: 'error.dark',
                  bgcolor: 'error.lighter',
                }
              }}
            >
              Vymazať všetky obrázky
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default CreatePostView; 