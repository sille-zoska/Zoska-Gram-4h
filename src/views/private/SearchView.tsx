// src/views/private/SearchView.tsx

"use client";

// React imports
import { useEffect, useState } from "react";

// MUI imports
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";

// Server action import
import { fetchProfiles } from "@/app/actions/profiles";

// Profile type definition
interface Profile {
  id: string;
  user: {
    name: string | null;
  };
  avatarUrl?: string | null; // Allow null from the API response
  location?: string | null;
  bio?: string | null;
}

const SearchView = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        const fetchedProfiles: Profile[] = await fetchProfiles(searchTerm);
        setProfiles(fetchedProfiles);
      } catch (error) {
        console.error("Failed to fetch profiles:", error);
      }
    };

    if (searchTerm.trim()) {
      loadProfiles();
    } else {
      setProfiles([]);
    }
  }, [searchTerm]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Hľadať profily
      </Typography>
      <TextField
        label="Hľadať podľa mena alebo záujmov"
        fullWidth
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 4 }}
      />
      <Grid container spacing={2}>
        {profiles.map((profile) => (
          <Grid item xs={12} sm={6} md={4} key={profile.id}>
            <Card>
              <CardContent>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <Avatar
                      src={profile.avatarUrl || undefined}
                      alt={profile.user.name || "Profil"}
                    >
                      {profile.user.name?.charAt(0) || "?"}
                    </Avatar>
                  </Grid>
                  <Grid item xs>
                    <Typography variant="h6">
                      {profile.user.name || "Neznámy používateľ"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {profile.location || "Lokalita neznáma"}
                    </Typography>
                    <Typography variant="body2">
                      {profile.bio || "Bez popisu"}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SearchView;
