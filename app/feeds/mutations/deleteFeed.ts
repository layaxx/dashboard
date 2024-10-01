import { resolver } from "@blitzjs/rpc"
import { z } from "zod"
import db from "db"

const DeleteFeed = z.object({
  id: z.number(),
  removeEntries: z.boolean(),
})

export default resolver.pipe(
  resolver.zod(DeleteFeed),
  resolver.authorize(),
  async ({ id, removeEntries }) => {
    if (removeEntries) {
      await db.feedentry.deleteMany({ where: { feedId: id } })
    }
    const feed = await db.feed.delete({ where: { id } })

    await db.feed.updateMany({
      data: { position: { decrement: 1 } },
      where: { position: { gt: feed.position } },
    })

    return feed
  },
)
