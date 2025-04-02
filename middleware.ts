import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Paths that require authentication
const protectedPaths = [
    "/prispevky",
    "/profily",
    "/nastavenia",
];

// Paths that are only accessible to non-authenticated users
const authPaths = [
    "/auth/prihlasenie",
    "/auth/registracia",
];

export async function middleware(request: NextRequest) {
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const { pathname } = request.nextUrl;

    // Check if the path is protected
    const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
    const isAuthPath = authPaths.some(path => pathname.startsWith(path));

    // Redirect authenticated users trying to access auth pages to feed
    if (isAuthPath && token) {
        return NextResponse.redirect(new URL("/prispevky", request.url));
    }

    // Redirect unauthenticated users trying to access protected pages to login
    if (isProtectedPath && !token) {
        const url = new URL("/auth/prihlasenie", request.url);
        url.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * 1. /api/ (API routes)
         * 2. /_next/ (Next.js internals)
         * 3. /fonts/ (static files)
         * 4. /favicon.ico, /sitemap.xml (static files)
         */
        "/((?!api|_next|fonts|favicon.ico|sitemap.xml).*)",
    ],
}; 