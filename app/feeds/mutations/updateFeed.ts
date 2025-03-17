import { resolver } from "@blitzjs/rpc"
import { z } from "zod"
import db from "db"
import { MINIMUM_LOAD_INTERVAL_MINUTES } from "lib/feeds/feedHelpers"

const UpdateFeed = z.object({
  id: z.number(),
  url: z.string().optional(),
  name: z.string().optional(),
  position: z.number().optional(),
  loadIntervall: z.number().gte(MINIMUM_LOAD_INTERVAL_MINUTES).optional(),
  etag: z.string().optional(),
  lastLoad: z.string().optional(),
  isActive: z.boolean().optional(),
})

export default resolver.pipe(
  resolver.zod(UpdateFeed),
  resolver.authorize(),
  async ({ id, ...data }) => {
    const feed = await db.feed.update({ data, where: { id } })

    return feed
  },
)
