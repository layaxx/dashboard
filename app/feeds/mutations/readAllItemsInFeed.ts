import { resolver } from "@blitzjs/rpc"
import { z } from "zod"
import db from "db"

const Options = z.object({
  feedId: z.number(),
  read: z.boolean().optional().default(true),
})

export default resolver.pipe(
  resolver.zod(Options),
  resolver.authorize(),
  async ({ read, feedId }) =>
    await db.feedentry.updateMany({ where: { feedId }, data: { isArchived: read } })
)
