<<<<<<< HEAD
// src/app/gdpr/page.tsx


import Typography from "@mui/material/Typography";

export const metadata = { title: "GDPR | ZoškaSnap" };

export default function GDPR() {

  return (

      <Typography> GDPR </Typography>

  );
}



=======
// src/app/(public)/gdpr/page.tsx


// Relative imports
import GDPRView from "@/views/public/GDPRView";

export const metadata = { title: "GDPR | ZoškaSnap" };

// GDPR Page Component
const GDPRPage = () => <GDPRView />;

export default GDPRPage;
>>>>>>> c12de16 (Initial commit with all project files)
