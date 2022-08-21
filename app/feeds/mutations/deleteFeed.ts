import { resolver } from "@blitzjs/rpc"
import { z } from "zod"
import db from "db"

const DeleteFeed = z.object({
  id: z.number(),
  removeEntries: z.boolean().optional().default(false),
})

export default resolver.pipe(
  resolver.zod(DeleteFeed),
  resolver.authorize(),
  async ({ id, removeEntries }) => {
    if (removeEntries) {
      await db.feedentry.deleteMany({ where: { feedId: id } })
    }
    const feed = await db.feed.deleteMany({ where: { id } })

    return feed
  }
)
