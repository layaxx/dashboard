import { resolver, NotFoundError } from "blitz"
import { z } from "zod"
import db from "db"

const GetFeed = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetFeed), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const feed = await db.feed.findFirst({ where: { id } })

  if (!feed) throw new NotFoundError()

  return feed
})
