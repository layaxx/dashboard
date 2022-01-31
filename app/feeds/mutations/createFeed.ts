import { resolver } from "blitz"
import { z } from "zod"
import db from "db"

const CreateFeed = z.object({
  name: z.string(),
  number: z.number(),
})

export default resolver.pipe(resolver.zod(CreateFeed), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const feed = await db.feed.create({ data: input })

  return feed
})
