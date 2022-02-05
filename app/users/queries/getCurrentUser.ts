/* eslint-disable unicorn/no-null */
import { Ctx } from "blitz"
import db from "db"

export default async function getCurrentUser(_ = null, { session }: Ctx) {
  if (!session.userId) return null

  const user = await db.user.findFirst({
    select: { email: true, id: true, name: true, role: true },
    where: { id: session.userId },
  })

  return user
}
