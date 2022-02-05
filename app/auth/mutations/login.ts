import { resolver, SecurePassword, AuthenticationError } from "blitz"
import { Login } from "../validations"
import db from "db"
import { Role } from "types"

export const authenticateUser = async (rawEmail: string, rawPassword: string) => {
  const { email, password } = Login.parse({ email: rawEmail, password: rawPassword })
  const user = await db.user.findFirst({ where: { email } })
  if (!user) throw new AuthenticationError()

  const result = await SecurePassword.verify(user.hashedPassword, password)

  if (result === SecurePassword.VALID_NEEDS_REHASH) {
    // Upgrade hashed password with a more secure hash
    const improvedHash = await SecurePassword.hash(password)
    await db.user.update({ data: { hashedPassword: improvedHash }, where: { id: user.id } })
  }

  const { hashedPassword, ...rest } = user
  return rest
}

export default resolver.pipe(resolver.zod(Login), async ({ email, password }, context) => {
  // This throws an error if credentials are invalid
  const user = await authenticateUser(email, password)

  await context.session.$create({
    role: user.role as Role,
    userId: user.id,
    userName: user.name || user.email,
  })

  return user
})
