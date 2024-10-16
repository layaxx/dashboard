import { resolver } from "@blitzjs/rpc"
import { z } from "zod"
import db from "db"

const CreateFeedoption = z.object({
  id: z.number(),
  expand: z.boolean(),
  oldestFirst: z.boolean(),
})

export default resolver.pipe(resolver.zod(CreateFeedoption), resolver.authorize(), async (data) => {
  return await db.feedoption.create({ data })
})
