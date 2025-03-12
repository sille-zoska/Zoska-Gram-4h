// src/app/api/auth/[...nextauth]/authOptions.ts

import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { compare } from "bcrypt";
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    // CredentialsProvider({
    //   name: "Credentials",
    //   credentials: {
    //     email: { label: "Email", type: "email" },
    //     password: { label: "Heslo", type: "password" },
    //   },
    //   async authorize(credentials) {
    //     if (!credentials?.email || !credentials?.password) {
    //       throw new Error("Vyplňte email a heslo");
    //     }
    //
    //     const user = await prisma.user.findUnique({
    //       where: { email: credentials.email },
    //     });
    //
    //     if (!user || !user.password) {
    //       throw new Error("Nesprávny email alebo heslo");
    //     }
    //
    //     const isPasswordValid = await compare(credentials.password, user.password);
    //
    //     if (!isPasswordValid) {
    //       throw new Error("Nesprávny email alebo heslo");
    //     }
    //
    //     return {
    //       id: user.id,
    //       email: user.email,
    //       name: user.name,
    //       image: user.image,
    //     };
    //   },
    // }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: '/auth/prihlasenie',
    signOut: '/auth/odhlasenie',
    verifyRequest: "/auth/overenie", // Used for email verification
    error: "/auth/prihlasenie", // Error page
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub || "";
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to feed page after sign-in
      return url.startsWith(baseUrl)
        ? url
        : `${baseUrl}/prispevok`;
    },
  },
};




