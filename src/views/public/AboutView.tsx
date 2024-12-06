// src/views/public/AboutView.tsx


// MUI imports
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

// Custom imports
import CustomLink from "@/components/CustomLink";

// Content import
import aboutContent from "@/content/aboutContent";

const AboutView = () => (
  <Container
    maxWidth="md"
    sx={{
      mt: 5,
      p: 3,
      bgcolor: "background.paper",
      boxShadow: 3,
      borderRadius: 2,
    }}
  >
    {/* Title */}
    <Typography variant="h4" gutterBottom>
      {aboutContent.title}
    </Typography>

    {/* Introduction */}
    <Typography variant="body1" paragraph>
      {aboutContent.introduction}
    </Typography>

    {/* Links */}
    {aboutContent.links.map((link, index) => (
      <Typography key={index} variant="body1" sx={{ mb: 1 }}>
        <CustomLink href={link.url} text={link.label} />
      </Typography>
    ))}
  </Container>
);

export default AboutView;
