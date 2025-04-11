import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { prisma } from "../../prisma/prisma";

// Set route to be dynamic to fix build error
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return new NextResponse(
                JSON.stringify({ error: "Unauthorized" }),
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { profile: true }
        });

        if (!user) {
            return new NextResponse(
                JSON.stringify({ error: "User not found" }),
                { status: 404 }
            );
        }

        if (!user.profile) {
            return new NextResponse(
                JSON.stringify({ hasProfile: false }),
                { status: 404 }
            );
        }

        return new NextResponse(
            JSON.stringify({ hasProfile: true }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error checking profile:", error);
        return new NextResponse(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500 }
        );
    }
} 