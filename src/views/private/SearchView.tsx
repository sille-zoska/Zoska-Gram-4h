// src/views/private/SearchView.tsx

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

// Import the server action and its types
import {
  fetchProfilesCursor,
  ProfileWithUser,
  FetchProfilesCursorParams,
} from "@/app/actions/profiles";

/** How many profiles to fetch at once */
const TAKE_COUNT = 20;

/**
 * Infinite-scrolling search for user profiles,
 * similar to Instagram's search for profiles view.
 */
export default function SearchView() {
  // Our local state uses the EXACT type that Prisma returns:
  const [profiles, setProfiles] = useState<ProfileWithUser[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // We'll observe this sentinel <div> at the bottom for infinite scroll
  const observerRef = useRef<HTMLDivElement>(null);

  /**
   * Loads the next page of profiles (if any).
   * Called on mount, on searchTerm change, and when the sentinel enters the viewport.
   */
  const loadProfiles = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const { profiles: newProfiles, nextCursor } = await fetchProfilesCursor({
        take: TAKE_COUNT,
        cursor,
        searchTerm,
      });

      // Append newProfiles to whatever we had
      setProfiles((prev) => [...prev, ...newProfiles]);

      // Update the cursor
      setCursor(nextCursor);

      // If we didn't get a nextCursor, there's no more data to load
      if (!nextCursor) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to fetch profiles:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, cursor, searchTerm]);

  /**
   * Set up an IntersectionObserver to load more when the sentinel is in view.
   */
  useEffect(() => {
    const target = observerRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        loadProfiles();
      }
    });

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [loadProfiles]);

  /**
   * Whenever searchTerm changes (the user typed something),
   * reset our state so we fetch fresh results.
   */
  useEffect(() => {
    setProfiles([]);
    setCursor(undefined);
    setHasMore(true);
    setLoading(false);
  }, [searchTerm]);

  /**
   * On mount or whenever searchTerm changes, loadProfiles immediately.
   */
  useEffect(() => {
    loadProfiles();
  }, [searchTerm, loadProfiles]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Hľadať profily
      </Typography>

      {/* Search bar */}
      <TextField
        label="Hľadať podľa mena alebo záujmov"
        fullWidth
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 4 }}
      />

      {/* Profile results grid */}
      <Grid container spacing={2}>
        {profiles.map((profile) => (
          <Grid item xs={12} sm={6} md={4} key={profile.id}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar
                    src={profile.avatarUrl || undefined}
                    alt={profile.user.name || "Profil"}
                    sx={{ width: 56, height: 56, mr: 2 }}
                  >
                    {/* Fallback letter if no avatar */}
                    {profile.user.name?.[0] ?? "?"}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {profile.user.name || "Neznámy používateľ"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {profile.location || "Lokalita neznáma"}
                    </Typography>
                  </Box>
                </Box>
                {profile.bio && (
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    {profile.bio}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* The sentinel div for IntersectionObserver to trigger more loading */}
      <div ref={observerRef} style={{ height: 1 }} />

      {/* Loading indicator */}
      {loading && (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress />
        </Box>
      )}

      {/* If we have no more data, show a small message at the bottom */}
      {!hasMore && !loading && profiles.length > 0 && (
        <Typography align="center" sx={{ my: 2 }} color="text.secondary">
          Všetky profily sú načítané.
        </Typography>
      )}
    </Container>
  );
}




