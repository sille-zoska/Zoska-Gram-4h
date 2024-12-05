// src/app/(private)/layout.tsx

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
