// src/app/actions/profiles.ts

"use server";

// Prisma imports
import { prisma } from "@/app/api/prisma/prisma";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { revalidatePath } from 'next/cache';

// TypeScript interfaces
export interface FetchProfilesCursorParams {
  cursor?: string;
  take?: number;
  searchTerm?: string;
}

type UserWithPosts = Prisma.UserGetPayload<{
  include: { posts: true };
}>;

type ProfileWithFollowCounts = Prisma.ProfileGetPayload<{
  include: {
    user: {
      include: {
        posts: true;
        followers: {
          include: {
            follower: {
              select: {
                id: true;
                email: true;
                name: true;
              }
            }
          }
        };
        following: {
          include: {
            following: {
              select: {
                id: true;
                email: true;
                name: true;
              }
            }
          }
        };
      };
    };
  };
}>;

export type ProfileWithUser = ProfileWithFollowCounts;

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
              },
              include: {
                images: {
                  orderBy: {
                    order: 'asc'
                  }
                }
              },
              take: 3
            },
            followers: {
              include: {
                follower: {
                  select: {
                    id: true,
                    email: true,
                    name: true,
                  }
                }
              }
            },
            following: {
              include: {
                following: {
                  select: {
                    id: true,
                    email: true,
                    name: true,
                  }
                }
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
): Promise<ProfileWithUser | null> => {
  try {
    // First, try to find a profile by ID
    let profile = await prisma.profile.findUnique({
      where: { id: profileId },
      include: {
        user: {
          include: {
            posts: {
              include: {
                images: {
                  orderBy: {
                    order: 'asc'
                  }
                }
              },
              orderBy: {
                createdAt: 'desc'
              }
            },
            followers: {
              include: {
                follower: {
                  select: {
                    id: true,
                    email: true,
                    name: true,
                  }
                }
              }
            },
            following: {
              include: {
                following: {
                  select: {
                    id: true,
                    email: true,
                    name: true,
                  }
                }
              }
            }
          },
        },
      },
    });

    // If not found by profile ID, try to find by user ID
    if (!profile) {
      const user = await prisma.user.findUnique({
        where: { id: profileId },
      });

      if (user) {
        // Check if the user has a profile
        profile = await prisma.profile.findUnique({
          where: { userId: user.id },
          include: {
            user: {
              include: {
                posts: {
                  include: {
                    images: {
                      orderBy: {
                        order: 'asc'
                      }
                    }
                  },
                  orderBy: {
                    createdAt: 'desc'
                  }
                },
                followers: {
                  include: {
                    follower: {
                      select: {
                        id: true,
                        email: true,
                        name: true,
                      }
                    }
                  }
                },
                following: {
                  include: {
                    following: {
                      select: {
                        id: true,
                        email: true,
                        name: true,
                      }
                    }
                  }
                }
              },
            },
          },
        });

        // If user exists but no profile, create a default profile
        if (!profile && user) {
          profile = await prisma.profile.create({
            data: {
              userId: user.id,
              bio: "",
              location: "",
              avatarUrl: user.image,
              interests: [],
            },
            include: {
              user: {
                include: {
                  posts: {
                    include: {
                      images: {
                        orderBy: {
                          order: 'asc'
                        }
                      }
                    },
                    orderBy: {
                      createdAt: 'desc'
                    }
                  },
                  followers: {
                    include: {
                      follower: {
                        select: {
                          id: true,
                          email: true,
                          name: true,
                        }
                      }
                    }
                  },
                  following: {
                    include: {
                      following: {
                        select: {
                          id: true,
                          email: true,
                          name: true,
                        }
                      }
                    }
                  }
                },
              },
            },
          });
        }
      }
    }

    if (!profile) {
      console.log("Profile not found for ID:", profileId);
      return null;
    }

    return profile;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
};

// Get current user's profile
export const getCurrentUserProfile = async (): Promise<ProfileWithUser | null> => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return null;
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      include: {
        user: {
          include: {
            posts: {
              include: {
                user: true,
                likes: true,
                comments: true,
                bookmarks: true,
                images: {
                  orderBy: {
                    order: 'asc'
                  }
                }
              },
              orderBy: {
                createdAt: 'desc',
              },
            },
            followers: {
              include: {
                follower: true,
              },
            },
            following: {
              include: {
                following: true,
              },
            },
          },
        },
      },
    });

    return profile;
  } catch (error) {
    console.error("Error fetching current user profile:", error);
    throw new Error("Could not fetch profile");
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
            followers: {
              include: {
                follower: {
                  select: {
                    id: true,
                    email: true,
                    name: true,
                  }
                }
              }
            },
            following: {
              include: {
                following: {
                  select: {
                    id: true,
                    email: true,
                    name: true,
                  }
                }
              }
            }
          },
        },
      },
    });

    revalidatePath('/profil');
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
            followers: {
              include: {
                follower: {
                  select: {
                    id: true,
                    email: true,
                    name: true,
                  }
                }
              }
            },
            following: {
              include: {
                following: {
                  select: {
                    id: true,
                    email: true,
                    name: true,
                  }
                }
              }
            }
          },
        },
      },
    });

    revalidatePath('/profil');
    return newProfile;
  } catch (error) {
    console.error("Error creating profile:", error);
    throw new Error("Could not create profile");
  }
};

// Follow user action
export async function followUser(userId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new Error("Neprihlásený používateľ");
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      throw new Error("Používateľ sa nenašiel");
    }

    // Check if already following
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUser.id,
          followingId: userId,
        },
      },
    });

    if (existingFollow) {
      return { message: "Už sledujete tohto používateľa" };
    }

    // Create follow relationship
    await prisma.follow.create({
      data: {
        followerId: currentUser.id,
        followingId: userId,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error following user:", error);
    throw new Error("Nepodarilo sa sledovať používateľa");
  }
}

// Unfollow user action
export async function unfollowUser(userId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new Error("Neprihlásený používateľ");
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      throw new Error("Používateľ sa nenašiel");
    }

    // Delete follow relationship
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: currentUser.id,
          followingId: userId,
        },
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error unfollowing user:", error);
    throw new Error("Nepodarilo sa prestať sledovať používateľa");
  }
}

interface ProfileData {
  userId: string;
  bio?: string;
  location?: string;
  avatarUrl?: string;
  interests?: string[];
}

export async function fetchProfile(userId: string) {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId },
    });

    return profile;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw new Error('Failed to fetch profile');
  }
}

// Add this function to fetch a user's bookmarked posts
export async function fetchUserBookmarks() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new Error("Neprihlásený používateľ");
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      throw new Error("Používateľ sa nenašiel");
    }

    // Get all bookmarks with their posts
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: user.id },
      include: {
        post: {
          include: {
            user: true,
            likes: {
              include: {
                user: true,
              },
            },
            comments: {
              include: {
                user: true,
              },
            },
            bookmarks: {
              include: {
                user: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Extract the posts from the bookmarks
    return bookmarks.map(bookmark => bookmark.post);
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    throw new Error("Nepodarilo sa načítať záložky");
  }
}


