import { resolver } from "blitz"
import { z } from "zod"
import db from "db"

const DeleteFeed = z.object({
  id: z.number(),
})

export default resolver.pipe(resolver.zod(DeleteFeed), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const feed = await db.feed.deleteMany({ where: { id } })

  return feed
})
