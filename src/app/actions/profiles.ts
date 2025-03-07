// src/app/actions/profiles.ts

"use server";

// Prisma imports
import { prisma } from "@/app/api/auth/[...nextauth]/prisma";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

// TypeScript interfaces
export interface FetchProfilesCursorParams {
  cursor?: string;
  take?: number;
  searchTerm?: string;
}

type UserWithPosts = Prisma.UserGetPayload<{
  include: { posts: true };
}>;

export type ProfileWithUser = Prisma.ProfileGetPayload<{
  include: {
    user: {
      include: {
        posts: true;
      }
    }
  };
}>;

interface FetchProfilesCursorResult {
  profiles: ProfileWithUser[];
  nextCursor?: string;
}

// Fetch profiles with user info and their posts
export const fetchProfilesCursor = async ({
  cursor,
  take = 20,
  searchTerm = "",
}: FetchProfilesCursorParams): Promise<FetchProfilesCursorResult> => {
  try {
    const whereClause: Prisma.ProfileWhereInput = searchTerm.trim()
      ? {
        OR: [
          {
            user: {
              name: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          },
          { interests: { has: searchTerm } },
        ],
      }
      : {};

    const profiles = await prisma.profile.findMany({
      where: whereClause,
      include: {
        user: {
          include: {
            posts: {
              orderBy: {
                createdAt: 'desc'
              }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      profiles,
      nextCursor: undefined,
    };
  } catch (error) {
    console.error("Error in fetchProfilesCursor:", error);
    throw new Error("Could not fetch profiles");
  }
};

// Fetch a single profile by ID with user details and posts
export const fetchProfileById = async (
  profileId: string
): Promise<ProfileWithUser> => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
      include: {
        user: {
          include: {
            posts: {
              orderBy: { createdAt: "desc" },
            },
          },
        },
      },
    });

    if (!profile) {
      throw new Error("Profile not found");
    }

    return profile;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw new Error("Could not fetch profile");
  }
};

// Get current user's profile
export const getCurrentUserProfile = async (): Promise<ProfileWithUser | null> => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new Error("Not authenticated");
    }

    const profile = await prisma.profile.findFirst({
      where: {
        user: {
          email: session.user.email
        }
      },
      include: {
        user: {
          include: {
            posts: {
              orderBy: { createdAt: "desc" },
            },
          },
        },
      },
    });

    return profile;
  } catch (error) {
    console.error("Error getting current user profile:", error);
    throw new Error("Could not get current user profile");
  }
};

// Update profile
interface UpdateProfileData {
  name?: string;
  bio?: string;
  location?: string;
  avatarUrl?: string;
}

export const updateProfile = async (data: UpdateProfileData): Promise<ProfileWithUser> => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new Error("Not authenticated");
    }

    // First, update the user's name
    const updatedUser = await prisma.user.update({
      where: {
        email: session.user.email
      },
      data: {
        name: data.name
      }
    });

    // Then, update the profile
    const updatedProfile = await prisma.profile.update({
      where: {
        userId: updatedUser.id
      },
      data: {
        bio: data.bio,
        location: data.location,
        avatarUrl: data.avatarUrl,
      },
      include: {
        user: {
          include: {
            posts: {
              orderBy: { createdAt: "desc" },
            },
          },
        },
      },
    });

    return updatedProfile;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw new Error("Could not update profile");
  }
};

// Create new profile for user
export const createProfile = async (data: UpdateProfileData): Promise<ProfileWithUser> => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new Error("Not authenticated");
    }

    // First, update the user's name
    const updatedUser = await prisma.user.update({
      where: {
        email: session.user.email
      },
      data: {
        name: data.name
      }
    });

    // Then, create the profile
    const newProfile = await prisma.profile.create({
      data: {
        userId: updatedUser.id,
        bio: data.bio,
        location: data.location,
        avatarUrl: data.avatarUrl,
      },
      include: {
        user: {
          include: {
            posts: {
              orderBy: { createdAt: "desc" },
            },
          },
        },
      },
    });

    return newProfile;
  } catch (error) {
    console.error("Error creating profile:", error);
    throw new Error("Could not create profile");
  }
};


