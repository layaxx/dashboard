import { resolver } from "@blitzjs/rpc"
import { z } from "zod"
import db from "db"

const UpdateFeedoption = z.object({
  id: z.number(),
  expand: z.boolean(),
  ordering: z.enum(["OLDEST_FIRST", "NEWEST_FIRST", "RANDOM"]),
  imageHandling: z.enum(["NONE", "SUPPRESS", "LIMIT_HEIGHT_10"]),
})

export default resolver.pipe(
  resolver.zod(UpdateFeedoption),
  resolver.authorize(),
  async ({ id, ...data }) => {
    const feedoption = await db.feedoption.update({ data, where: { id } })

    return feedoption
  },
)
