// src/app/podmienky/page.tsx


<<<<<<< HEAD
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

export const metadata = { title: "Podmienky | ZoškaSnap" };

export default function TermsConditions() {

  return (
    <Container>
      <Typography> Podmienky používania </Typography>
    </Container>
  );
}
=======
// Relative imports
import TermsConditionsView from "@/views/public/TermsConditionsView";

export const metadata = { title: "Podmienky používania | ZoškaSnap" };

// Terms and Conditions Page Component
const TermsConditionsPage = () => <TermsConditionsView />;

export default TermsConditionsPage;
>>>>>>> c12de16 (Initial commit with all project files)
