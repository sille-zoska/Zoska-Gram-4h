// src/types/post.ts

// Post interface used across the application
export interface Post {
    id: string;
    userId: string;
    imageUrl: string;
    caption: string | null;
    createdAt: Date;
    updatedAt: Date;
    user: {
        id: string;
        name: string | null;
        email: string;
        emailVerified: Date | null;
        image: string | null;
        createdAt: Date;
        updatedAt: Date;
    };
} 