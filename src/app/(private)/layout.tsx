// src/app/(private)/layout.tsx

<<<<<<< HEAD
import AuthGuard from "@/components/AuthGuard";

export const metadata = { title: "Protected | SnapZoška" };

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return 
  <AuthGuard redirectPath="/auth/registracia">
    {children}
  </AuthGuard>; 
}
=======
// Relative imports
import AuthGuard from "@/components/AuthGuard";
import Box from "@mui/material/Box";

// Metadata for the layout
export const metadata = { title: "Protected | SnapZoška" };

// PrivateLayout Component
const PrivateLayout = ({ children }: { children: React.ReactNode }) => (
  <AuthGuard redirectPath="/auth/registracia">
    <Box
        sx={{
          minHeight: "100vh", 
          display: "flex",
          justifyContent: "center", 
          alignItems: "flex-start",
          backgroundColor: "background.default",
          px: 2, 
        }}
      >
        {children}
      </Box>
  </AuthGuard>
);

export default PrivateLayout;
>>>>>>> c12de16 (Initial commit with all project files)
