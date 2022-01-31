import { resolver } from "blitz"
import { z } from "zod"
import db from "db"

const UpdateFeed = z.object({
  id: z.number(),
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateFeed),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const feed = await db.feed.update({ where: { id }, data })

    return feed
  }
)
