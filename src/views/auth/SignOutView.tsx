"use client";

// React imports
import { useState } from "react";

// NextAuth imports
import { signOut } from "next-auth/react";

// Next.js imports
import { useRouter } from "next/navigation";

// MUI imports
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";

interface SignOutViewProps {
  open?: boolean;
  onClose?: () => void;
}

// SignOut View Component
const SignOutView = ({ open = true, onClose }: SignOutViewProps) => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Internal handler for closing the dialog
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.push("/");
    }
  };

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      // Let NextAuth handle the redirect completely
      await signOut({ 
        redirect: true,
        callbackUrl: "/" // Simple home page redirect
      });
      // No need for handleClose() here
    } catch (error) {
      console.error("Error signing out:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: 3,
          px: 1,
        },
      }}
    >
      <DialogTitle sx={{ textAlign: "center", pt: 3 }}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 12,
            top: 12,
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h5" fontWeight={600}>
          Odhlásiť sa
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ textAlign: "center", py: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <LogoutIcon color="primary" sx={{ fontSize: 50 }} />
        </Box>
        <Typography variant="body1">
          Naozaj sa chcete odhlásiť z aplikácie ZoškaGram?
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 3, flexDirection: "column", gap: 1 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={handleSignOut}
          disabled={isLoggingOut}
          sx={{
            borderRadius: 50,
            py: 1,
            fontWeight: "bold",
            backgroundColor: "error.main",
            "&:hover": {
              backgroundColor: "error.dark",
            },
          }}
        >
          {isLoggingOut ? "Odhlasovanie..." : "Áno, odhlásiť sa"}
        </Button>
        <Button
          variant="outlined"
          fullWidth
          onClick={handleClose}
          sx={{
            borderRadius: 50,
            py: 1,
            fontWeight: "bold",
          }}
        >
          Zrušiť
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SignOutView;