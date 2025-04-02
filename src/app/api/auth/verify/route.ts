import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../prisma/prisma";

// Schema for validating input data
const VerifySchema = z.object({
    email: z.string().email("Neplatný email"),
    code: z.string().length(6, "Kód musí mať 6 číslic"),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate request body
        const validation = VerifySchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.errors[0].message },
                { status: 400 }
            );
        }

        const { email, code } = validation.data;

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Používateľ s týmto emailom neexistuje" },
                { status: 404 }
            );
        }

        // Check if user is already verified
        if (user.emailVerified) {
            return NextResponse.json(
                { error: "Email je už overený" },
                { status: 400 }
            );
        }

        // Find verification code
        const verificationCode = await prisma.verificationCode.findFirst({
            where: {
                email,
                code,
                expires: { gt: new Date() }, // Not expired
            },
        });

        if (!verificationCode) {
            return NextResponse.json(
                { error: "Neplatný alebo expirovaný kód" },
                { status: 400 }
            );
        }

        // Mark user as verified
        await prisma.user.update({
            where: { email },
            data: { emailVerified: new Date() },
        });

        // Delete verification codes for this email
        await prisma.verificationCode.deleteMany({
            where: { email },
        });

        return NextResponse.json(
            { success: true, message: "Email bol úspešne overený" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Verification error:", error);
        return NextResponse.json(
            { error: "Niečo sa pokazilo pri overovaní emailu" },
            { status: 500 }
        );
    }
} 