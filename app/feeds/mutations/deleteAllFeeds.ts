import { resolver } from "@blitzjs/rpc"
import { z } from "zod"
import db from "db"

const DeleteFeed = z.object({
  confirm: z.boolean(),
})

export default resolver.pipe(
  resolver.zod(DeleteFeed),
  resolver.authorize(),
  async ({ confirm }) => {
    if (!confirm) {
      throw new Error("Please confirm that you wish to delete ALL Feeds. This cannot be undone.")
    }
    const feed = await db.feed.deleteMany()

    return feed
  }
)
