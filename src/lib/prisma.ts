import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Prisma 7: connection URLs live in prisma.config.ts for the CLI, and
// the runtime client takes a driver adapter. The pg pool connects
// lazily, so constructing this without DATABASE_URL (e.g. during
// `next build`) is safe.
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL ?? "postgresql://localhost:5432/crm",
})

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
