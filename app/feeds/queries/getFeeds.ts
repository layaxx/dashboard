import { resolver } from "@blitzjs/rpc"
import db, { Feed } from "db"

type FeedOmit = Partial<Record<keyof Feed, boolean>>

export default resolver.pipe(resolver.authorize(), async (omit: FeedOmit | null | undefined) => {
  const allFeeds = await db.feed.findMany({
    orderBy: { position: "asc" },
    omit,
    include: { options: true, _count: { select: { entries: { where: { isArchived: false } } } } },
  })

  return {
    feeds: allFeeds.map((feed) => ({
      ...feed,
      unreadCount: feed._count.entries,
    })),
  }
})
