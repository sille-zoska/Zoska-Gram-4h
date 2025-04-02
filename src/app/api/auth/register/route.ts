import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcrypt";
import { z } from "zod";
import { prisma } from "../../prisma/prisma";
import { sendEmail, generateVerificationEmailHTML } from "@/utils/email";

// Schema for validating input data
const RegisterSchema = z.object({
    email: z.string().email("Neplatný email"),
    password: z.string().min(8, "Heslo musí mať aspoň 8 znakov"),
    confirmPassword: z.string(),
    termsAccepted: z.boolean(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Heslá sa nezhodujú",
    path: ["confirmPassword"],
}).refine((data) => data.termsAccepted, {
    message: "Pre registráciu musíte súhlasiť s GDPR a podmienkami používania",
    path: ["termsAccepted"],
});

// Generate 6-digit verification code
const generateVerificationCode = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Add Prisma error type
interface PrismaError {
    code?: string;
    message: string;
    meta?: Record<string, unknown>;
}

// Type guard for Prisma error
const isPrismaError = (error: unknown): error is PrismaError => {
    return (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        typeof (error as PrismaError).code === 'string'
    );
};

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log('Registration request body:', {
            email: body.email,
            passwordLength: body?.password?.length,
            termsAccepted: body.termsAccepted
        });

        // Validate request body
        const validation = RegisterSchema.safeParse(body);

        if (!validation.success) {
            console.log('Validation error:', validation.error.errors);
            return NextResponse.json(
                { error: validation.error.errors[0].message },
                { status: 400 }
            );
        }

        const { email, password } = validation.data;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        // If user exists but not verified, we can resend verification code
        // If user exists and is verified, return error
        if (existingUser) {
            if (existingUser.emailVerified) {
                return NextResponse.json(
                    { error: "Používateľ s týmto emailom už existuje" },
                    { status: 400 }
                );
            }
            console.log('Existing unverified user found, will update');
        }

        // Hash password
        const hashedPassword = await hash(password, 10);

        // Generate verification code
        const code = generateVerificationCode();
        const expires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

        console.log('Creating/updating user and verification code');

        // Create or update user
        const user = existingUser
            ? await prisma.user.update({
                where: { email },
                data: { password: hashedPassword },
            })
            : await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                },
            });

        // Delete any existing verification codes for this email
        await prisma.verificationCode.deleteMany({
            where: { email },
        });

        // Create verification code in database
        await prisma.verificationCode.create({
            data: {
                email,
                code,
                expires,
            },
        });

        console.log('Attempting to send verification email');

        // Send verification email
        const emailSent = await sendEmail({
            to: email,
            subject: "Overovací kód pre ZoškaGram",
            html: generateVerificationEmailHTML(code),
        });

        if (!emailSent) {
            console.error('Failed to send verification email');
            return NextResponse.json(
                { error: "Nepodarilo sa odoslať overovací email. Skontrolujte správnosť emailovej adresy." },
                { status: 500 }
            );
        }

        console.log('Registration successful, verification email sent');

        return NextResponse.json(
            { success: true, message: "Overovací kód bol odoslaný na váš email" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        // Check if it's a Prisma error
        if (isPrismaError(error)) {
            console.error('Prisma error code:', error.code);
        }
        return NextResponse.json(
            { error: "Niečo sa pokazilo pri registrácii. Skúste to znova neskôr." },
            { status: 500 }
        );
    }
} 