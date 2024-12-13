// src/app/(public)/layout.tsx


// MUI imports
import Container from "@mui/material/Container";

// Metadata for the public layout
export const metadata = { title: "Public | SnapZoška" };

// PublicLayout Component
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <Container >
      {children} {/* Render public pages */}
    </Container>
  );
}
