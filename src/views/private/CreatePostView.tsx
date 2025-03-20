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

// Add this import
import { createPost } from "@/app/actions/posts";

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
  // Add session
  const { data: session } = useSession();
  const router = useRouter();
  
  // Add loading and error states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
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

  // Updated handleSubmit function to use Vercel Blob
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!formState.image.file || !session?.user) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      // 1. Upload the image to Vercel Blob
      const formData = new FormData();
      formData.append("file", formState.image.file);
      formData.append("folder", "posts");

      const response = await fetch("/api/images", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload image");
      }

      const { url: imageUrl } = await response.json();

      // 2. Create the post in the database
      await createPost(formState.caption, imageUrl);
      
      // 3. Clean up the preview URL
      if (formState.image.preview) {
        URL.revokeObjectURL(formState.image.preview);
      }
      
      // 4. Redirect to feed after successful creation
      router.push("/prispevok");
    } catch (error) {
      console.error("Failed to create post:", error);
      setUploadError(error instanceof Error ? error.message : "Failed to create post");
    } finally {
      setIsUploading(false);
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

        {uploadError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {uploadError}
          </Alert>
        )}

        <Button
          fullWidth
          variant="contained"
          type="submit"
          disabled={!formState.image.file || isUploading}
          sx={{ mb: 2 }}
        >
          {isUploading ? (
            <>
              <CircularProgress size={24} sx={{ mr: 1 }} color="inherit" />
              Nahrávam...
            </>
          ) : (
            "Zdieľať príspevok"
          )}
        </Button>

        {formState.image.preview && (
          <Button
            fullWidth
            color="error"
            onClick={handleImageClear}
            disabled={isUploading}
          >
            Zrušiť výber
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default CreatePostView; 