import { NotFoundError, SecurePassword, resolver } from "blitz"
import { ChangePassword } from "../validations"
import { authenticateUser } from "./login"
import db from "db"

export default resolver.pipe(
  resolver.zod(ChangePassword),
  resolver.authorize(),
  async ({ currentPassword, newPassword }, context) => {
    const user = await db.user.findFirst({ where: { id: context.session.userId! } })
    if (!user) throw new NotFoundError()

    await authenticateUser(user.email, currentPassword)

    const hashedPassword = await SecurePassword.hash(newPassword.trim())
    await db.user.update({
      data: { hashedPassword },
      where: { id: user.id },
    })

    return true
  }
)
