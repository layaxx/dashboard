import { enhancePrisma } from "blitz"
import { PrismaClient } from "@prisma/client"

const EnhancedPrisma = enhancePrisma(PrismaClient)

export * from "@prisma/client"
const enhancedPrismaInstance = new EnhancedPrisma()
export default enhancedPrismaInstance
