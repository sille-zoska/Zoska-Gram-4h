// src/types/post.ts

import { User } from "next-auth";

// Post interface used across the application
export interface Comment {
    id: string;
    content: string;
    postId: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    likes: CommentLike[];
}

export interface Like {
    id: string;
    postId: string;
    userId: string;
    createdAt: Date;
    user: User;
}

export interface CommentLike {
    id: string;
    commentId: string;
    userId: string;
    createdAt: Date;
}

export interface PostImage {
    id: string;
    postId: string;
    imageUrl: string;
    order: number;
    createdAt: Date;
}

export interface Post {
    id: string;
    userId: string;
    caption: string | null;
    imageUrl?: string;
    images?: PostImage[];
    createdAt: Date | string;
    updatedAt?: Date | string;
    comments: Comment[];
    likes: Like[];
    bookmarks?: Bookmark[];
    user: {
        id: string;
        name: string | null;
        email: string;
        image?: string | null;
        profile?: {
            id: string;
            userId: string;
            bio?: string | null;
            avatarUrl?: string | null;
            location?: string | null;
            interests?: string[];
        };
    };
    tags?: string[];
}

export interface Bookmark {
    id: string;
    userId: string;
    postId: string;
    createdAt?: Date | string;
    user: {
        id: string;
        name: string | null;
        email: string;
    };
} 