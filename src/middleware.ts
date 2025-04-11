import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// List of paths that don't require a profile check
const publicPaths = [
    '/auth/prihlasenie',
    '/auth/registracia',
    '/auth/overenie',
    '/auth/odhlasenie',
    '/o-nas',
    '/'
]

// Paths that are exempt from profile check (including the profile creation path)
const exemptPaths = [
    '/profily/upravit',
    '/api/',
    '/_next/'
]

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Skip middleware for public or exempt paths
    if (
        publicPaths.some(path => pathname.startsWith(path)) ||
        exemptPaths.some(path => pathname.startsWith(path))
    ) {
        return NextResponse.next()
    }

    // Get the user's token
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET
    })

    // If no token, redirect to login
    if (!token) {
        const url = new URL('/auth/prihlasenie', request.url)
        url.searchParams.set('callbackUrl', encodeURI(request.url))
        return NextResponse.redirect(url)
    }

    // Check if user has a profile by making a fetch to our API
    try {
        // Use absolute URL to avoid circular dependency during build
        const apiUrl = new URL('/api/profiles/check', process.env.NEXTAUTH_URL || request.url).toString()

        const res = await fetch(apiUrl, {
            headers: {
                'Cookie': request.headers.get('cookie') || '',
                'Content-Type': 'application/json'
            }
        })

        // If status is 404, user doesn't have a profile
        if (res.status === 404) {
            // Save the intended URL for after profile creation
            const returnToUrl = request.nextUrl.pathname
            const editProfileUrl = new URL('/profily/upravit', request.url)

            // Add returnTo param to redirect after profile creation
            if (returnToUrl !== '/profily/upravit') {
                editProfileUrl.searchParams.set('returnTo', returnToUrl)
            }

            return NextResponse.redirect(editProfileUrl)
        }

        // Other error statuses
        if (!res.ok) {
            console.error('Error checking profile:', await res.text())
        }
    } catch (error) {
        console.error('Error checking profile:', error)
    }

    return NextResponse.next()
}

export const config = {
    // Skip API routes in the matcher to avoid circular dependency
    matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)']
} 