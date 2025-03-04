"use client";

// React imports
import { useState } from "react";
import { useRouter } from "next/navigation";

// MUI imports
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const CreatePostView = () => {
  const router = useRouter();
  const [caption, setCaption] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      // Create a preview URL for the selected image
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: Implement post creation logic here
    // This will need to:
    // 1. Upload the image to storage
    // 2. Create the post in the database
    // 3. Redirect to the feed
  };

  return (
    <Container sx={{ mt: 4, maxWidth: "sm" }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Vytvoriť príspevok
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <Card sx={{ mb: 3 }}>
          {previewUrl ? (
            <CardMedia
              component="img"
              image={previewUrl}
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

        <TextField
          fullWidth
          multiline
          rows={4}
          label="Popis príspevku"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Button
          fullWidth
          variant="contained"
          type="submit"
          disabled={!selectedImage}
          sx={{ mb: 2 }}
        >
          Zdieľať príspevok
        </Button>

        {previewUrl && (
          <Button
            fullWidth
            color="error"
            onClick={() => {
              setSelectedImage(null);
              setPreviewUrl(null);
            }}
          >
            Zrušiť výber
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default CreatePostView; 