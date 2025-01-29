"use client";

// React imports
import { useEffect, useState } from "react";

// MUI imports
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";

// Server action import
import { fetchProfilesCursor } from "@/app/actions/profiles";

// Define a Profile interface matching your Prisma model
interface Profile {
  id: string;
  userId: string;
  bio?: string | null;
  avatarUrl?: string | null;
  location?: string | null;
  interests: string[];
  user: {
    name: string | null;
    email: string;
  };
}

const ProfilesView = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch profiles whenever searchTerm changes
//   useEffect(() => {
//     const loadProfiles = async () => {
//       try {
//         // If you want to fetch *all* profiles when there is no searchTerm,
//         // you could pass an empty string "" or handle that logic in the server action.
//         const fetchedProfiles = await fetchProfiles(searchTerm);
//         setProfiles(fetchedProfiles);
//       } catch (error) {
//         console.error("Failed to fetch profiles:", error);
//       }
//     };

//     loadProfiles();
//   }, [searchTerm]);

  return (
    <Container sx={{ mt: 4, maxWidth: "md" }}>
        <Typography>Profily</Typography>
    </Container>
  );
};

export default ProfilesView;
