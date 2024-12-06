// src/views/public/GDPRView.tsx


// MUI imports
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

// Project imports
import BackButton from "@/components/BackButton";

// Content import
import gdprContent from "@/content/gdprContent";

const GDPRView = () => (
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
      {gdprContent.title}
    </Typography>

    {/* Introduction */}
    <Typography variant="body1" paragraph>
      {gdprContent.introduction}
    </Typography>

    {/* Sections */}
    {gdprContent.sections.map((section, index) => (
      <div key={index}>
        <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
          {section.heading}
        </Typography>
        <Typography variant="body1" paragraph>
          {section.text}
        </Typography>
      </div>
    ))}

    {/* Footer */}
    <Typography variant="body1" sx={{ mt: 4 }}>
      {gdprContent.footer}
    </Typography>

    {/* Back Button */}
    <BackButton />
  </Container>
);

export default GDPRView;
