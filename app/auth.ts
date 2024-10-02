// pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./lib/prismaClient";
import { compare } from "bcryptjs";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Role } from "@prisma/client"; // Import enum Role dari Prisma

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) {
          throw new Error("Email and password are required.");
        }

        const user = await prisma.employee.findUnique({
          where: {
            email: email,
          },
        });

        if (!user || !(await compare(password, user.password))) {
          throw new Error("Invalid email or password.");
        }

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          role: user.role || undefined, // Mengembalikan undefined jika role tidak ada
        };
      },
    }),
  ],

  callbacks: {
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          role: token.role as Role | undefined, // Cast untuk memastikan tipe yang tepat
        },
      };
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role; // Menyertakan role di token
      }
      return token;
    },
  },
});
