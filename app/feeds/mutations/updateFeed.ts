import { resolver } from "blitz"
import { z } from "zod"
import db from "db"

const UpdateFeed = z.object({
  id: z.number(),
  url: z.string().optional(),
  name: z.string().optional(),
  position: z.number().optional(),
  loadIntervall: z.number().optional(),
  etag: z.string().optional(),
  lastLoad: z.string().optional(),
})

export default resolver.pipe(
  resolver.zod(UpdateFeed),
  resolver.authorize(),
  async ({ id, ...data }) => {
    const feed = await db.feed.update({ data, where: { id } })

    return feed
  }
)
