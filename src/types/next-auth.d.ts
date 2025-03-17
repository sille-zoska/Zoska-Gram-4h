import "next-auth";

declare module "next-auth" {
    interface User {
        id?: string;
        image?: string | null;
    }

    interface Session {
        user: User & {
            id?: string;
            image?: string | null;
        }
    }
} 