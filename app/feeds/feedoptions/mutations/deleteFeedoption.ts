import { resolver } from "@blitzjs/rpc"
import { z } from "zod"
import db from "db"

const DeleteFeedoption = z.object({
  id: z.number(),
})

export default resolver.pipe(
  resolver.zod(DeleteFeedoption),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const feedoption = await db.feedoption.deleteMany({ where: { id } })

    return feedoption
  }
)
