import { resolver } from "blitz"
import db from "db"

export default resolver.pipe(resolver.authorize(), async () => {
  const allFeeds = await db.feed.findMany()
  const unreadCounts = await db.feedentry.groupBy({
    by: ["feedId"],
    _count: { id: true },
    where: { isArchived: false },
  })

  return {
    feeds: allFeeds.map((feed) => ({
      ...feed,
      unreadCount:
        unreadCounts.find((aggregateResult) => aggregateResult.feedId === feed.id)?._count.id ?? 0,
    })),
    recentlyReadCount: await db.feedentry.count({
      where: { isArchived: true },
      orderBy: { updatedAt: "desc" },
      take: 20,
    }),
  }
})
