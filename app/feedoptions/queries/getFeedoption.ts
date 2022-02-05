import { resolver } from "blitz"
import { z } from "zod"
import db from "db"

const GetFeedoption = z.object({
  id: z.number(),
})

export default resolver.pipe(resolver.zod(GetFeedoption), resolver.authorize(), async ({ id }) => {
  const feedoption = await db.feedoption.findFirst({ where: { id } })

  if (!feedoption) return await db.feedoption.create({ data: { id } })

  return feedoption
})
