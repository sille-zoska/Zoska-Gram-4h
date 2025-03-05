// src/app/actions/profiles.ts

"use server";

// Prisma imports
import { prisma } from "@/app/api/auth/[...nextauth]/prisma";
import { Prisma } from "@prisma/client";

// TypeScript interfaces
export interface FetchProfilesCursorParams {
  cursor?: string;
  take?: number;
  searchTerm?: string;
}

export type ProfileWithUser = Prisma.ProfileGetPayload<{
  include: { user: true };
}>;

interface FetchProfilesCursorResult {
  profiles: ProfileWithUser[];
  nextCursor?: string;
}

type UserWithPosts = Prisma.UserGetPayload<{
  include: { posts: true };
}>;

interface ProfileWithUserAndPosts extends Omit<ProfileWithUser, 'user'> {
  user: UserWithPosts;
}

// Fetch profiles with optional search and pagination
export const fetchProfilesCursor = async ({
  cursor,
  take = 20,
  searchTerm = "",
}: FetchProfilesCursorParams): Promise<FetchProfilesCursorResult> => {
  try {
    // Build the WHERE clause if a searchTerm is provided
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

    // For small datasets, we can fetch all profiles at once
    const profiles = await prisma.profile.findMany({
      where: whereClause,
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    return {
      profiles,
      nextCursor: undefined, // No need for pagination with small dataset
    };
  } catch (error) {
    console.error("Error in fetchProfilesCursor:", error);
    throw new Error("Could not fetch profiles");
  }
};

// Fetch a single profile by ID with user details and posts
export const fetchProfileById = async (
  profileId: string
): Promise<ProfileWithUserAndPosts> => {
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

    return profile as ProfileWithUserAndPosts;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw new Error("Could not fetch profile");
  }
};


