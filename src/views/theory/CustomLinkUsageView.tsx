// src/views/theory/CustomLinkUsageView.tsx

// MUI imports
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

// Custom imports
import CustomLink from "@/components/CustomLink";

// TestView Component
const CustomLinkUsageView = () => (
  <Container
    maxWidth="sm"
    sx={{
      mt: 5,
      bgcolor: "background.paper",
      p: 3,
      borderRadius: 2,
      boxShadow: 3,
    }}
  >
    <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
      CustomLink Usage Examples
    </Typography>

    <Typography
      variant="body1"
      sx={{ mb: 4, textAlign: "center", color: "text.secondary" }}
    >
      Explore different styles and props for the <strong>CustomLink</strong>{" "}
      component. Hover over the links to see dynamic effects.
    </Typography>

    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
        Default Link
      </Typography>
      <CustomLink href="https://zochova.sk" text="Default Link Example" />
    </Box>

    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
        Light Theme Customization
      </Typography>
      <CustomLink
        href="https://example.com"
        text="Light Theme Example"
        color="primary.main"
        openInNewTab
        sx={{
          fontWeight: "lighter",
          fontStyle: "italic",
          textDecoration: "underline",
          "&:hover": {
            color: "secondary.main",
            textDecoration: "none",
          },
        }}
      />
    </Box>

    <Box>
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
        Dark Theme Customization
      </Typography>
      <CustomLink
        href="https://example.com"
        text="Dark Theme Example"
        color="text.primary"
        openInNewTab
        sx={{
          fontWeight: "bold",
          fontStyle: "italic",
          textDecoration: "overline",
          "&:hover": {
            color: "primary.main",
            textDecoration: "line-through",
          },
        }}
      />
    </Box>
  </Container>
);

export default CustomLinkUsageView;


