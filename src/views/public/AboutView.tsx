// src/views/public/AboutView.tsx


// MUI imports
import Typography from "@mui/material/Typography";

// Custom imports
import CustomLink from "@/components/CustomLink";

// Content import
import aboutContent from "@/content/aboutContent";

const AboutView = () => (
  <>
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
        <CustomLink href={link.url} text={link.label} openInNewTab />
      </Typography>
    ))}
  </>
);

export default AboutView;
