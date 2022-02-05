import { resolver, SecurePassword } from "blitz"
import { Signup } from "app/auth/validations"
import db from "db"
import { Role } from "types"

export default resolver.pipe(resolver.zod(Signup), async ({ email, password }, context) => {
  const hashedPassword = await SecurePassword.hash(password.trim())
  const user = await db.user.create({
    data: { email: email.toLowerCase().trim(), hashedPassword, role: "USER" },
    select: { email: true, id: true, name: true, role: true },
  })

  await context.session.$create({
    role: user.role as Role,
    userId: user.id,
    userName: user.name || user.email,
  })
  return user
})
