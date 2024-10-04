import { resolver } from "@blitzjs/rpc"
import { z } from "zod"
import db from "db"

const UpdateFeedoption = z.object({
  id: z.number(),
  name: z.string(),
  expand: z.boolean(),
  oldestFirst: z.boolean(),
})

export default resolver.pipe(
  resolver.zod(UpdateFeedoption),
  resolver.authorize(),
  async ({ id, ...data }) => {
    const feedoption = await db.feedoption.update({ data, where: { id } })

    return feedoption
  },
)
