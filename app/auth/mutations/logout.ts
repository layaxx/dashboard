import { Ctx } from "blitz"

export default async function logout(_: never, context: Ctx) {
  return await context.session.$revoke()
}
