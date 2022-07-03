import { resolver } from "blitz"
import { z } from "zod"
import db from "db"

const DeleteFeedEntry = z.object({
  id: z.string(),
})

export default resolver.pipe(
  resolver.zod(DeleteFeedEntry),
  resolver.authorize(),
  async ({ id }) => {
    const feedEntry = await db.feedentry.deleteMany({ where: { id } })

    return feedEntry
  }
)
