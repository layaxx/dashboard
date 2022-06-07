import { resolver, NotFoundError } from "blitz"
import { z } from "zod"
import db from "db"

const GetFeedentry = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.string().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetFeedentry), resolver.authorize(), async ({ id }) => {
  const feedentry = await db.feedentry.findFirst({ where: { id } })

  if (!feedentry) throw new NotFoundError()

  return feedentry
})
