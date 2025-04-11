"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import EditProfileView from "@/views/private/EditProfileView";
import { CircularProgress, Box } from "@mui/material";

export default function EditProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");

  useEffect(() => {
    // If not authenticated, redirect to login
    if (status === "unauthenticated") {
      router.push("/auth/prihlasenie");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!session?.user?.id) {
    return null;
  }

  return (
    <EditProfileView 
      profileId={session.user.id} 
      returnTo={returnTo || "/prispevky"} 
    />
  );
} 