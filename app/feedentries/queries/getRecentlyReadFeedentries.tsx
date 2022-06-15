import { resolver } from "blitz"
import db from "db"

export default resolver.pipe(resolver.authorize(), async () => {
  return {
    feedentries: await db.feedentry.findMany({
      where: { isArchived: true },
      orderBy: { updatedAt: "desc" },
      take: 20,
    }),
  }
})
