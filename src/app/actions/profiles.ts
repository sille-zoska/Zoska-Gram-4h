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

  // Strictly type the .findMany() arguments
  const query: Prisma.ProfileFindManyArgs = {
    where: whereClause,
    include: { user: true },
    orderBy: { createdAt: "desc" },
    take,
  };

  if (cursor) {
    query.cursor = { id: cursor };
    query.skip = 1; // skip the cursor item itself
  }

  // Fetch the page of profiles
  const rawProfiles = await prisma.profile.findMany(query);

  // Determine the "nextCursor" (for the next batch)
  let nextCursor: string | undefined;
  if (rawProfiles.length > 0) {
    nextCursor = rawProfiles[rawProfiles.length - 1].id;
  }

  /**
   * If your DB truly guarantees that `user` always exists (no null),
   * you can safely cast to `ProfileWithUser[]`.
   */
  return {
    profiles: rawProfiles as ProfileWithUser[],
    nextCursor,
  };
}


