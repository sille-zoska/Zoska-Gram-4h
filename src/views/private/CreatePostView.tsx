"use client";

// React and Next.js imports
import { useState } from "react";
import { useRouter } from "next/navigation";

// MUI Component imports
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Card,
  CardMedia,
} from "@mui/material";

// MUI Icon imports
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";

// Types
type FormState = {
  caption: string;
  image: {
    file: File | null;
    preview: string | null;
  };
};

/**
 * CreatePostView Component
 * 
 * Allows users to create new posts with images and captions.
 * Features:
 * - Image upload with preview
 * - Caption input
 * - Form validation
 * - Responsive layout
 */
const CreatePostView = () => {
  // Hooks
  const router = useRouter();
  
  // State
  const [formState, setFormState] = useState<FormState>({
    caption: "",
    image: {
      file: null,
      preview: null
    }
  });

  // Event handlers
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create a preview URL for the selected image
      const previewUrl = URL.createObjectURL(file);
      setFormState(prev => ({
        ...prev,
        image: {
          file,
          preview: previewUrl
        }
      }));
    }
  };

  const handleCaptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState(prev => ({
      ...prev,
      caption: event.target.value
    }));
  };

  const handleImageClear = () => {
    // Clean up the preview URL to prevent memory leaks
    if (formState.image.preview) {
      URL.revokeObjectURL(formState.image.preview);
    }
    
    setFormState(prev => ({
      ...prev,
      image: {
        file: null,
        preview: null
      }
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!formState.image.file) return;

    try {
      // TODO: Implement post creation logic:
      // 1. Upload the image to storage
      // 2. Create the post in the database
      // 3. Redirect to the feed
      
      // Clean up the preview URL
      if (formState.image.preview) {
        URL.revokeObjectURL(formState.image.preview);
      }
      
      // Redirect to feed after successful creation
      router.push("/prispevok");
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  // Render functions
  const renderImageUpload = () => (
    <Card sx={{ mb: 3 }}>
      {formState.image.preview ? (
        <CardMedia
          component="img"
          image={formState.image.preview}
          alt="Náhľad obrázku"
          sx={{ aspectRatio: "1/1", objectFit: "cover" }}
        />
      ) : (
        <Box
          sx={{
            aspectRatio: "1/1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "grey.100",
          }}
        >
          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
          >
            Vybrať obrázok
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageSelect}
            />
          </Button>
        </Box>
      )}
    </Card>
  );

  // Main render
  return (
    <Container sx={{ mt: 4, maxWidth: "sm" }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Vytvoriť príspevok
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        {renderImageUpload()}

        <TextField
          fullWidth
          multiline
          rows={4}
          label="Popis príspevku"
          value={formState.caption}
          onChange={handleCaptionChange}
          sx={{ mb: 3 }}
        />

        <Button
          fullWidth
          variant="contained"
          type="submit"
          disabled={!formState.image.file}
          sx={{ mb: 2 }}
        >
          Zdieľať príspevok
        </Button>

        {formState.image.preview && (
          <Button
            fullWidth
            color="error"
            onClick={handleImageClear}
          >
            Zrušiť výber
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default CreatePostView; 