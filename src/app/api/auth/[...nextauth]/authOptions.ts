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
    newUser: "/profil/upravit", // Redirect new users to profile edit page
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      console.log("session callback", session, token);
      if (token && session.user) {
        session.user.id = token.sub || "";
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log("redirecting to", url);

      // Handle sign-out redirects properly
      if (url.includes('/api/auth/signout')) {
        return `${baseUrl}/`; // Redirect to home page after sign-out (without parameters)
      }

      // If the URL already points to the home page, don't redirect again
      if (url === baseUrl || url === `${baseUrl}/`) {
        return url;
      }

      // Handle new user redirect
      if (url.includes('?newUser=true')) {
        return `${baseUrl}/profil/upravit`;
      }

      // For regular sign-in, redirect to feed page
      // Only redirect to /prispevok if it's a sign-in operation
      if (url.includes('/api/auth/callback') || url.includes('/api/auth/signin')) {
        return `${baseUrl}/prispevok`;
      }

      // For all other cases, don't redirect
      return url;
    },
  },
};




