// src/app/actions/posts.ts

"use server";

// Prisma imports
import { prisma } from "@/app/api/prisma/prisma";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

// Type imports
import { Post } from "@/types/post";

// Type for Prisma Post with included user, comments and likes
type PrismaPostWithDetails = Prisma.PostGetPayload<{
  include: {
    user: true;
    comments: {
      include: {
        user: true;
        likes: {
          include: {
            user: true;
          };
        };
        replies: {
          include: {
            user: true;
            likes: {
              include: {
                user: true;
              };
            };
          };
        };
      };
    };
    likes: {
      include: {
        user: true;
      };
    };
  };
}>;

// Add this type to your Post type to include bookmarks
export type PostWithDetails = Prisma.PostGetPayload<{
  include: {
    user: true;
    likes: {
      include: {
        user: true;
      }
    };
    comments: {
      include: {
        user: true;
        likes: true;
      }
    };
    bookmarks: {
      include: {
        user: true;
      }
    };
  }
}>;

// Fetch all posts with user information, comments and likes
export const fetchPosts = async (): Promise<PrismaPostWithDetails[]> => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        comments: {
          include: {
            user: true,
            likes: {
              include: {
                user: true
              }
            },
            replies: {
              include: {
                user: true,
                likes: {
                  include: {
                    user: true
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        likes: {
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
    });

    return posts;
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
      include: {
        user: true,
        comments: {
          include: {
            user: true,
            likes: {
              include: {
                user: true
              }
            }
          }
        },
        likes: {
          include: {
            user: true
          }
        }
      }
    });

    return posts;
  } catch (error) {
    console.error("Error fetching posts by userId:", error);
    throw new Error("Could not fetch posts");
  }
};

// Create a new post with image and optional caption
export async function createPost(caption: string, imageUrl: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    const post = await prisma.post.create({
      data: {
        caption,
        imageUrl,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        likes: true,
        comments: true,
        bookmarks: true, // Include bookmarks to match your Post type
      },
    });

    return post;
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error("Failed to create post");
  }
}

// Create a new comment
export const createComment = async (postId: string, content: string): Promise<PrismaPostWithDetails> => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new Error("Not authenticated");
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    await prisma.comment.create({
      data: {
        content,
        postId,
        userId: user.id,
      },
    });

    // Return updated post with new comment
    const updatedPost = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: true,
        comments: {
          include: {
            user: true,
            likes: {
              include: {
                user: true
              }
            },
            replies: {
              include: {
                user: true,
                likes: {
                  include: {
                    user: true
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        likes: {
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
    });

    if (!updatedPost) {
      throw new Error("Post not found");
    }

    return updatedPost;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw new Error("Could not create comment");
  }
};

// Delete a comment
export const deleteComment = async (commentId: string): Promise<PrismaPostWithDetails> => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new Error("Not authenticated");
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        user: {
          select: {
            id: true,
            email: true
          }
        }
      },
    });

    if (!comment) {
      throw new Error("Comment not found");
    }

    if (comment.user.email !== session.user.email) {
      throw new Error("Not authorized to delete this comment");
    }

    const postId = comment.postId; // Store postId before deletion

    try {
      await prisma.comment.delete({
        where: { id: commentId },
      });
    } catch (deleteError) {
      if (deleteError instanceof Prisma.PrismaClientKnownRequestError && deleteError.code === 'P2025') {
        throw new Error("Comment not found");
      }
      throw deleteError;
    }

    // Return updated post after comment deletion
    const updatedPost = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: true,
        comments: {
          include: {
            user: true,
            likes: {
              include: {
                user: true
              }
            },
            replies: {
              include: {
                user: true,
                likes: {
                  include: {
                    user: true
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        likes: {
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
    });

    if (!updatedPost) {
      throw new Error("Post not found after comment deletion");
    }

    return updatedPost;
  } catch (error) {
    console.error("Error deleting comment:", error);
    if (error instanceof Error) {
      throw error; // Re-throw the original error to preserve the message
    }
    throw new Error("Could not delete comment");
  }
};

// Toggle like on a post
export const toggleLike = async (postId: string): Promise<PrismaPostWithDetails> => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new Error("Not authenticated");
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const existingLike = await prisma.like.findFirst({
      where: {
        postId,
        userId: user.id,
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
    } else {
      await prisma.like.create({
        data: {
          postId,
          userId: user.id,
        },
      });
    }

    // Return updated post with new like status
    const updatedPost = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: true,
        comments: {
          include: {
            user: true,
            likes: {
              include: {
                user: true
              }
            },
            replies: {
              include: {
                user: true,
                likes: {
                  include: {
                    user: true
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        likes: {
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
    });

    if (!updatedPost) {
      throw new Error("Post not found");
    }

    return updatedPost;
  } catch (error) {
    console.error("Error toggling like:", error);
    throw new Error("Could not toggle like");
  }
};

// Make sure toggleBookmark returns the updated post with bookmarks
export async function toggleBookmark(postId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { error: "Neprihlásený používateľ" };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return { error: "Používateľ sa nenašiel" };
    }

    // Check if bookmark already exists
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId: user.id,
          postId: postId,
        },
      },
    });

    if (existingBookmark) {
      // Remove bookmark
      await prisma.bookmark.delete({
        where: {
          userId_postId: {
            userId: user.id,
            postId: postId,
          },
        },
      });
    } else {
      // Add bookmark
      await prisma.bookmark.create({
        data: {
          userId: user.id,
          postId: postId,
        },
      });
    }

    // Return updated post with bookmarks
    const updatedPost = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: true,
        comments: {
          include: {
            user: true,
            likes: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        likes: {
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
    });

    return updatedPost;
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    return { error: "Nepodarilo sa pridať/odobrať záložku" };
  }
}

// Add this server action to fetch bookmarked posts
export async function fetchBookmarkedPosts() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const bookmarks = await prisma.bookmark.findMany({
    where: {
      userId: user.id,
    },
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
              likes: true,
            },
            orderBy: {
              createdAt: "desc",
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
      createdAt: "desc",
    },
  });

  return bookmarks.map(bookmark => bookmark.post);
}


