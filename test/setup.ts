import dotenv from "dotenv"
import createMockContext from "./createMockContext"
import { prismaMock } from "./globalSetup"

beforeAll(async () => {
  dotenv.config()

  await prismaMock.$reset()

  let newUser = await prismaMock.user.findFirst()

  if (!newUser) {
    newUser = await prismaMock.user.create({
      data: { email: "testing@localhost.localdomain", name: "Testing", role: "ADMIN" },
    })
  }

  const { ctx: contextAuthorized } = await createMockContext({ user: newUser, isAuthorized: true })
  global.ctx = {}
  global.ctx.authorized = contextAuthorized

  const { ctx: contextNotAuthorized } = await createMockContext({ user: newUser })
  global.ctx.notAuthorized = contextNotAuthorized
})
