import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";

const THIRTY_DAYS_SECONDS = 30 * 24 * 60 * 60;

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!url || !anonKey) {
          console.error("[NextAuth] Missing Supabase env for auth");
          throw new Error("Server configuration error");
        }

        try {
          const supabase = createClient(url, anonKey);
          const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email.trim(),
            password: credentials.password,
          });

          if (error) {
            if (error.message.includes("Invalid login")) {
              throw new Error("Invalid email or password");
            }
            throw new Error(error.message || "Sign in failed");
          }

          if (!data.user?.id) {
            throw new Error("Invalid email or password");
          }

          const admin = await prisma.admin.findUnique({
            where: { supabaseId: data.user.id },
          });

          if (!admin) {
            throw new Error("Access denied. You are not an administrator.");
          }

          return {
            id: admin.id,
            email: admin.email,
            supabaseId: admin.supabaseId,
          };
        } catch (err) {
          if (err instanceof Error) throw err;
          throw new Error("Authentication failed");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: THIRTY_DAYS_SECONDS,
    updateAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = (user as { email?: string }).email ?? "";
        token.supabaseId = (user as { supabaseId?: string }).supabaseId ?? "";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.supabaseId = token.supabaseId;
      }
      return session;
    },
    async signIn() {
      return true;
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
