import { resolver } from "@blitzjs/rpc"
import { z } from "zod"
import db from "db"

const DeleteFeedEntry = z.object({
  confirm: z.boolean(),
})

export default resolver.pipe(
  resolver.zod(DeleteFeedEntry),
  resolver.authorize(),
  async ({ confirm }) => {
    if (!confirm) {
      throw new Error(
        "Please confirm that you wish to delete ALL FeedEntries. This cannot be undone."
      )
    }
    const feedEntry = await db.feedentry.deleteMany()

    return feedEntry
  }
)
