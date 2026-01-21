import { PrismaClientKnownRequestError } from "db/generated/prisma/runtime/client"

export function isKnownRequestError(error: Error): error is PrismaClientKnownRequestError {
  return error.name === "PrismaClientKnownRequestError" && "code" in error && "meta" in error
}
