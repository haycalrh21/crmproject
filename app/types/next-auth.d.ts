// types/next-auth.d.ts
import NextAuth from "next-auth";
import { Role } from "@prisma/client"; // Pastikan mengimpor enum Role dari Prisma

declare module "next-auth" {
  interface User {
    id: string;
    role?: Role; // Ubah menjadi Role | undefined
  }

  interface Session {
    user: User;
  }
}
