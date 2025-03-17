// src/app/(public)/auth/layout.tsx

// Material-UI imports
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

const AuthLayout = ({ children }: { children: React.ReactNode }) => (
  <Box
    sx={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'background.default',
      px: 2,
    }}
  >
    <Container
      maxWidth="xs"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 3,
        bgcolor: 'background.paper',
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      {children}
    </Container>
  </Box>
);

export default AuthLayout;
