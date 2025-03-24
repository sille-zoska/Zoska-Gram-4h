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
      router.push("/prispevok");
    } catch (error) {
      console.error("Failed to create post:", error);
      setUploadError(error instanceof Error ? error.message : "Failed to create post");
    } finally {
      setIsUploading(false);
    }
  };

  // Render functions
  const renderImageGrid = () => (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {formState.images.map((image, index) => (
        <Grid item xs={6} sm={4} key={index}>
          <Card sx={{ position: 'relative' }}>
            <CardMedia
              component="img"
              image={image.preview}
              alt={`Image ${index + 1}`}
              sx={{ aspectRatio: "1/1", objectFit: "cover" }}
            />
            <IconButton
              size="small"
              color="error"
              sx={{ 
                position: 'absolute', 
                top: 8, 
                right: 8,
                backgroundColor: 'rgba(255,255,255,0.7)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.9)',
                }
              }}
              onClick={() => handleRemoveImage(index)}
              disabled={isUploading}
            >
              <DeleteIcon />
            </IconButton>
          </Card>
        </Grid>
      ))}
      
      {formState.images.length < MAX_IMAGES && (
        <Grid item xs={6} sm={4}>
          <Card 
            sx={{ 
              aspectRatio: "1/1", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              backgroundColor: "grey.100",
              border: '1px dashed grey.300'
            }}
          >
            <Button
              component="label"
              variant="outlined"
              startIcon={<AddIcon />}
              disabled={isUploading}
            >
              Add Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageSelect}
                multiple
              />
            </Button>
          </Card>
        </Grid>
      )}
    </Grid>
  );

  // Main render
  return (
    <Container sx={{ mt: 4, maxWidth: "sm" }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Create Post
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        {renderImageGrid()}

        <TextField
          fullWidth
          multiline
          rows={4}
          label="Caption"
          value={formState.caption}
          onChange={handleCaptionChange}
          sx={{ mb: 3 }}
        />

        {uploadError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {uploadError}
          </Alert>
        )}

        <Button
          fullWidth
          variant="contained"
          type="submit"
          disabled={formState.images.length === 0 || isUploading}
          sx={{ mb: 2 }}
        >
          {isUploading ? (
            <>
              <CircularProgress size={24} sx={{ mr: 1 }} color="inherit" />
              Uploading...
            </>
          ) : (
            "Share Post"
          )}
        </Button>

        {formState.images.length > 0 && (
          <Button
            fullWidth
            color="error"
            onClick={handleClearAll}
            disabled={isUploading}
          >
            Clear All Images
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default CreatePostView; 