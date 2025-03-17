// src/views/public/GDPRView.tsx

'use client'
// MUI imports
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

// Project imports
import BackButton from "@/components/BackButton";

// Content import
import gdprContent from "@/content/gdprContent";

const GDPRView = () => (
  <>
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
  </>
);

export default GDPRView;
