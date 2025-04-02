import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../prisma/prisma";
import { sendEmail, generateVerificationEmailHTML } from "@/utils/email";

// Schema for validating input data
const ResendCodeSchema = z.object({
    email: z.string().email("Neplatný email"),
});

// Generate 6-digit verification code
const generateVerificationCode = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate request body
        const validation = ResendCodeSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.errors[0].message },
                { status: 400 }
            );
        }

        const { email } = validation.data;

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

        // Generate new verification code
        const code = generateVerificationCode();
        const expires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

        // Delete any existing verification codes for this email
        await prisma.verificationCode.deleteMany({
            where: { email },
        });

        // Create new verification code
        await prisma.verificationCode.create({
            data: {
                email,
                code,
                expires,
            },
        });

        // Send verification email
        const emailSent = await sendEmail({
            to: email,
            subject: "Overovací kód pre ZoškaGram",
            html: generateVerificationEmailHTML(code),
        });

        if (!emailSent) {
            return NextResponse.json(
                { error: "Nepodarilo sa odoslať overovací email" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Overovací kód bol znova odoslaný na váš email" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Resend code error:", error);
        return NextResponse.json(
            { error: "Niečo sa pokazilo pri odosielaní kódu" },
            { status: 500 }
        );
    }
} 