// src/app/actions/posts.ts

"use server";

// Prisma imports
import { prisma } from "@/app/api/auth/[...nextauth]/prisma";
import { Prisma } from "@prisma/client";

// Type imports
import { Post } from "@/types/post";

// Type for Prisma Post with included user
type PrismaPostWithUser = Prisma.PostGetPayload<{
  include: { user: true };
}>;

// Fetch all posts with user information
export const fetchPosts = async (): Promise<Post[]> => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: true },
    });

    return posts as Post[];
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Could not fetch posts");
  }
};

// Fetch posts by a specific user ID
export const fetchPostsByUserId = async (userId: string): Promise<Post[]> => {
  try {
    const posts = await prisma.post.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { user: true },
    });

    return posts as Post[];
  } catch (error) {
    console.error("Error fetching posts by userId:", error);
    throw new Error("Could not fetch posts");
  }
};

// Create a new post with image and optional caption
export const createPost = async (
  userId: string,
  imageUrl: string,
  caption?: string
): Promise<Post> => {
  try {
    const newPost = await prisma.post.create({
      data: {
        userId,
        imageUrl,
        caption,
      },
      include: { user: true },
    });

    return newPost as Post;
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error("Could not create post");
  }
};


