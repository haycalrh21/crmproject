// src/prismaClient.ts

import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

// Menggunakan globalThis untuk menyimpan instance Prisma
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

// Menyimpan instance pada globalThis jika bukan di lingkungan produksi
if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
