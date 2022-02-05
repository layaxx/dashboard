import { Ctx } from "blitz"

export default async function logout(_: any, context: Ctx) {
  return await context.session.$revoke()
}
