// src/app/(public)/layout.tsx


// MUI imports
import Container from "@mui/material/Container";

// Metadata for the public layout
export const metadata = { title: "Public | SnapZoška" };

// PublicLayout Component
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <Container
      // maxWidth="md"
      // sx={{
      //   mt: 5,
      //   p: 3,
      //   bgcolor: "background.paper",
      //   boxShadow: 3,
      //   borderRadius: 2,
      // }}
    >
      {children} {/* Render public pages */}
    </Container>
  );
}
