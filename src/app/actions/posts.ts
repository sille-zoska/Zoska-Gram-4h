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
    images: true; // Include post images
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
    images: true; // Include post images
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
        images: {
          orderBy: {
            order: "asc", // Order images by their specified order
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
        },
        images: {
          orderBy: {
            order: "asc"
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

// Create a new post with images and optional caption
export async function createPost(caption: string, imageUrls: string[]) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    const post = await prisma.post.create({
      data: {
        caption,
        userId: session.user.id,
        images: {
          create: imageUrls.map((imageUrl, index) => ({
            imageUrl,
            order: index
          }))
        }
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
        bookmarks: true,
        images: true, // Include images
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
        images: true,
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
        images: true,
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
        images: true,
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
        images: true,
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
          images: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return bookmarks.map(bookmark => bookmark.post);
}

export async function fetchPostById(postId: string): Promise<PostWithDetails> {
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: true,
        images: {
          orderBy: {
            order: 'asc'
          }
        },
        comments: {
          include: {
            user: true,
            likes: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        likes: {
          include: {
            user: true
          }
        },
        bookmarks: {
          include: {
            user: true
          }
        }
      }
    });

    if (!post) {
      throw new Error("Post not found");
    }

    return post;
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
}

export async function likePost(postId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        likes: true
      }
    });

    if (!post) {
      throw new Error("Post not found");
    }

    const existingLike = post.likes.find(like => like.userId === session.user.id);
    if (existingLike) {
      throw new Error("Post already liked");
    }

    await prisma.like.create({
      data: {
        postId,
        userId: session.user.id
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Error liking post:", error);
    throw error;
  }
}

export async function unlikePost(postId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        likes: true
      }
    });

    if (!post) {
      throw new Error("Post not found");
    }

    const existingLike = post.likes.find(like => like.userId === session.user.id);
    if (!existingLike) {
      throw new Error("Post not liked");
    }

    await prisma.like.delete({
      where: {
        id: existingLike.id
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Error unliking post:", error);
    throw error;
  }
}

export async function bookmarkPost(postId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        bookmarks: true
      }
    });

    if (!post) {
      throw new Error("Post not found");
    }

    const existingBookmark = post.bookmarks.find(bookmark => bookmark.userId === session.user.id);
    if (existingBookmark) {
      throw new Error("Post already bookmarked");
    }

    await prisma.bookmark.create({
      data: {
        postId,
        userId: session.user.id
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Error bookmarking post:", error);
    throw error;
  }
}

export async function unbookmarkPost(postId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        bookmarks: true
      }
    });

    if (!post) {
      throw new Error("Post not found");
    }

    const existingBookmark = post.bookmarks.find(bookmark => bookmark.userId === session.user.id);
    if (!existingBookmark) {
      throw new Error("Post not bookmarked");
    }

    await prisma.bookmark.delete({
      where: {
        id: existingBookmark.id
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Error unbookmarking post:", error);
    throw error;
  }
}

// Delete a post and all its associated data
export async function deletePost(postId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    // First verify the post exists and belongs to the user
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: true
      }
    });

    if (!post) {
      throw new Error("Post not found");
    }

    if (post.userId !== session.user.id) {
      throw new Error("Not authorized to delete this post");
    }

    // Delete the post and all related data (comments, likes, bookmarks, images)
    // Prisma will handle the cascading deletes based on our schema
    await prisma.post.delete({
      where: { id: postId }
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
}


