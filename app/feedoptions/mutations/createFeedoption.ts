import { resolver } from "blitz"
import { z } from "zod"
import db from "db"

const CreateFeedoption = z.object({
  id: z.number(),
})

export default resolver.pipe(
  resolver.zod(CreateFeedoption),
  resolver.authorize(),
  async ({ id }) => {
    return await db.feedoption.create({ data: { id } })
  }
)
