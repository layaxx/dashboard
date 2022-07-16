import dotenv from "dotenv"
import createMockContext from "./createMockContext"
import db from "db"

beforeAll(async () => {
  dotenv.config()

  await db.$reset()

  let newUser = await db.user.findFirst()

  if (!newUser) {
    newUser = await db.user.create({
      data: { email: "testing@localhost.localdomain", name: "Testing", role: "ADMIN" },
    })
  }

  const { ctx: contextAuthorized } = await createMockContext({ user: newUser, isAuthorized: true })
  global.ctx = {}
  global.ctx.authorized = contextAuthorized

  const { ctx: contextNotAuthorized } = await createMockContext({ user: newUser })
  global.ctx.notAuthorized = contextNotAuthorized
})
