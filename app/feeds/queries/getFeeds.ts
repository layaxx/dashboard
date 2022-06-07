import { resolver } from "blitz"
import db from "db"

export default resolver.pipe(resolver.authorize(), async () => {
  const allFeeds = await db.feed.findMany()
  return {
    feeds: await Promise.all(
      allFeeds.map(async (feed) => ({
        ...feed,
        unreadCount: await db.feedentry.count({ where: { feedId: feed.id, isArchived: false } }),
      }))
    ),
  }
})
