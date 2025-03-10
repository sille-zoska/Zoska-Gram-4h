"use client";

// React and Next.js imports
import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

// MUI Component imports
import {
  Container,
  Typography,
  Box,
  Avatar,
  Button,
  Grid,
  Divider,
  ImageList,
  ImageListItem,
  CircularProgress,
} from "@mui/material";

// MUI Icon imports
import {
  PersonAdd as PersonAddIcon,
  PersonRemove as PersonRemoveIcon,
  GridView as GridViewIcon,
} from "@mui/icons-material";

// Server actions
import { 
  fetchProfileById, 
  followUser, 
  unfollowUser 
} from "@/app/actions/profiles";

// Types
type ProfileDetailViewProps = {
  profileId: string;
};

type Post = {
  id: string;
  imageUrl: string;
  caption?: string | null;
  createdAt: Date;
};

type Follow = {
  id: string;
  followerId: string;
};

type User = {
  id: string;
  name: string | null;
  email: string;
  posts: Post[];
  followers: Follow[];
  following: Follow[];
};

type Profile = {
  id: string;
  userId: string;
  bio?: string | null;
  avatarUrl?: string | null;
  location?: string | null;
  interests: string[];
  user: User;
};

type LoadingState = {
  initial: boolean;
  follow: boolean;
};

/**
 * ProfileDetailView Component
 * 
 * Displays detailed information about a user's profile.
 * Features:
 * - View profile information
 * - Follow/unfollow user
 * - View user's posts grid
 * - Display follower/following counts
 */
const ProfileDetailView = ({ profileId }: ProfileDetailViewProps) => {
  // Hooks
  const { data: session } = useSession();
  
  // State
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<LoadingState>({
    initial: true,
    follow: false
  });
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  // Data fetching
  const loadProfile = useCallback(async () => {
    try {
      const data = await fetchProfileById(profileId);
      setProfile(data);
      
      // Check if current user is following this profile
      if (session?.user?.email) {
        const isCurrentUserFollowing = data.user.followers.some(
          follow => follow.followerId === data.userId
        );
        setIsFollowing(isCurrentUserFollowing);
      }
    } catch (err) {
      setError("Profil sa nepodarilo načítať");
      console.error("Failed to fetch profile:", err);
    } finally {
      setLoading(prev => ({ ...prev, initial: false }));
    }
  }, [profileId, session?.user?.email]);

  useEffect(() => {
    loadProfile();
  }, [profileId, session?.user?.email, loadProfile]);

  // Event handlers
  const handleFollowToggle = async () => {
    if (!profile || !session?.user?.email || loading.follow) return;

    setLoading(prev => ({ ...prev, follow: true }));
    try {
      const updatedProfile = isFollowing
        ? await unfollowUser(profile.user.id)
        : await followUser(profile.user.id);
      
      setProfile(updatedProfile);
      setIsFollowing(!isFollowing);
    } catch (error) {
      // Don't show error for "already following" case
      if (error instanceof Error && error.message !== "Already following this user") {
        console.error("Failed to toggle follow:", error);
        // Optionally show error message to user
      }
    } finally {
      setLoading(prev => ({ ...prev, follow: false }));
    }
  };

  // Helper functions
  const isOwnProfile = (): boolean => {
    if (!profile || !session?.user?.email) return false;
    return session.user.email === profile.user.email;
  };

  // Render functions
  const renderProfileHeader = () => (
    <Box sx={{ display: 'flex', mb: 4 }}>
      <Avatar
        src={profile?.avatarUrl || undefined}
        sx={{ width: 100, height: 100, mr: 4 }}
      >
        {profile?.user.name?.[0] || "U"}
      </Avatar>

      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ mr: 2 }}>
            {profile?.user.name || "Neznámy používateľ"}
          </Typography>
          {!isOwnProfile() && (
            <Button
              variant="contained"
              size="small"
              startIcon={isFollowing ? <PersonRemoveIcon /> : <PersonAddIcon />}
              onClick={handleFollowToggle}
              disabled={loading.follow}
            >
              {isFollowing ? "Nesledovať" : "Sledovať"}
            </Button>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 4, mb: 2 }}>
          <Typography>
            <strong>{profile?.user.posts.length || 0}</strong> príspevkov
          </Typography>
          <Typography>
            <strong>{profile?.user.followers.length || 0}</strong> sledovateľov
          </Typography>
          <Typography>
            <strong>{profile?.user.following.length || 0}</strong> sledovaných
          </Typography>
        </Box>

        {profile?.bio && (
          <Typography variant="body1" sx={{ mb: 1 }}>
            {profile.bio}
          </Typography>
        )}

        {profile?.location && (
          <Typography variant="body2" color="text.secondary">
            📍 {profile.location}
          </Typography>
        )}
      </Box>
    </Box>
  );

  const renderPostsGrid = () => (
    <>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <GridViewIcon /> Príspevky
        </Typography>
        
        <ImageList cols={3} gap={2}>
          {(profile?.user.posts || []).map((post) => (
            <ImageListItem 
              key={post.id}
              sx={{ 
                aspectRatio: '1/1',
                cursor: 'pointer',
                '&:hover': { opacity: 0.8 },
                position: 'relative',
              }}
            >
              <Image
                src={post.imageUrl}
                alt={post.caption || ""}
                fill
                sizes="(max-width: 768px) 33vw, 25vw"
                style={{ 
                  objectFit: 'cover',
                }}
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Box>

      {(!profile?.user.posts || profile.user.posts.length === 0) && (
        <Typography 
          align="center" 
          color="text.secondary"
          sx={{ mt: 4 }}
        >
          Zatiaľ žiadne príspevky
        </Typography>
      )}
    </>
  );

  // Loading and error states
  if (loading.initial) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !profile) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Typography color="error">{error || "Profil sa nenašiel"}</Typography>
      </Box>
    );
  }

  // Main render
  return (
    <Container sx={{ mt: 4, mb: 10 }}>
      {renderProfileHeader()}
      {renderPostsGrid()}
    </Container>
  );
};

export default ProfileDetailView; 