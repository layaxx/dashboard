import { enhancePrisma } from "blitz"
import { PrismaClient, Prisma } from "@prisma/client"

const EnhancedPrisma = enhancePrisma(PrismaClient)

export function isKnownRequestError(error: Error): error is Prisma.PrismaClientKnownRequestError {
  return error.name === "PrismaClientKnownRequestError" && "code" in error && "meta" in error
}

export * from "@prisma/client"
const enhancedPrismaInstance = new EnhancedPrisma()
export default enhancedPrismaInstance
