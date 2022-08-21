import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetFeedentriesInput
  extends Pick<Prisma.FeedentryFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy = { createdAt: "desc" }, skip = 0, take = 20 }: GetFeedentriesInput) => {
    const {
      items: feedentries,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.feedentry.count({ where: { ...where, isArchived: false } }),
      query: (paginateArguments) =>
        db.feedentry.findMany({
          ...paginateArguments,
          where: { ...where, isArchived: false },
          orderBy,
        }),
    })

    return {
      feedentries,
      nextPage,
      hasMore,
      count,
    }
  }
)
