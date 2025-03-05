// src/app/actions/profiles.ts

"use server";

import { prisma } from "@/app/api/auth/[...nextauth]/prisma";
import { Prisma } from "@prisma/client";

/**
 * The query parameters we can accept:
 * - cursor: last fetched profile ID for cursor pagination
 * - take: how many profiles to fetch at once
 * - searchTerm: optional text filtering
 */
export interface FetchProfilesCursorParams {
  cursor?: string;
  take?: number;
  searchTerm?: string;
}

/**
 * The exact shape of each Profile returned by `include: { user: true }`.
 * Because your schema shows `userId` is required, we can assume `user` is non-null.
 */
export type ProfileWithUser = Prisma.ProfileGetPayload<{
  include: { user: true };
}>;

/** The shape we return from our server action. */
interface FetchProfilesCursorResult {
  profiles: ProfileWithUser[];
  nextCursor?: string;
}

/**
 * Fetch a page of profiles using cursor-based pagination.
 */
export async function fetchProfilesCursor({
  cursor,
  take = 20,
  searchTerm = "",
}: FetchProfilesCursorParams): Promise<FetchProfilesCursorResult> {
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
}

/**
 * Fetch a single profile by ID, including user details and posts
 */
export async function fetchProfileById(profileId: string) {
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
      include: {
        user: {
          include: {
            posts: {
              orderBy: { createdAt: 'desc' }
            }
          }
        }
      }
    });

    if (!profile) {
      throw new Error('Profile not found');
    }

    return profile;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw new Error('Could not fetch profile');
  }
}


