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


