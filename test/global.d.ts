import { Ctx } from "blitz"

// Needed for test

declare global {
  var ctx: { authorized?: Ctx; notAuthorized?: Ctx }
}
