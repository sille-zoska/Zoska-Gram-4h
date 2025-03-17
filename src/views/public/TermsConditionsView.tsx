// src/views/public/TermsConditionsView.tsx


// MUI imports
import Typography from "@mui/material/Typography";

// Project imports
import BackButton from "@/components/BackButton";

// Content import
import termsContent from "@/content/termsContent";

const TermsConditionsView = () => (
  <>
    {/* Title */}
    <Typography variant="h4" gutterBottom>
      {termsContent.title}
    </Typography>

    {/* Introduction */}
    <Typography variant="body1" paragraph>
      {termsContent.introduction}
    </Typography>

    {/* Sections */}
    {termsContent.sections.map((section, index) => (
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
      {termsContent.footer}
    </Typography>

    {/* Back Button */}
    <BackButton />
  </>
);

export default TermsConditionsView;
