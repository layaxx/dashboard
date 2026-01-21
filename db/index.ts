import { enhancePrisma } from "blitz"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "db/generated/prisma/client"

const EnhancedPrisma = enhancePrisma(PrismaClient)

export * from "db/generated/prisma/client"

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})
const enhancedPrismaInstance = new EnhancedPrisma({ adapter })
export default enhancedPrismaInstance
