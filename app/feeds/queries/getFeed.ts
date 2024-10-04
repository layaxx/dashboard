import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import { z } from "zod"
import db from "db"

const GetFeed = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
  includeLoadEvents: z.boolean().optional().default(false),
})

export default resolver.pipe(
  resolver.zod(GetFeed),
  resolver.authorize(),
  async ({ id, includeLoadEvents }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const feed = await db.feed.findFirst({
      where: { id },
      include: {
        loadEvents: includeLoadEvents,
        options: true,
        _count: { select: { entries: { where: { isArchived: false } } } },
      },
    })

    if (!feed) throw new NotFoundError()

    return feed
  },
)
