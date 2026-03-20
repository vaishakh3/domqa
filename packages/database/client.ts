import { PrismaClient } from "@prisma/client";

declare global {
  var __domqaPrisma: PrismaClient | undefined;
}

export const prisma = global.__domqaPrisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") global.__domqaPrisma = prisma;
