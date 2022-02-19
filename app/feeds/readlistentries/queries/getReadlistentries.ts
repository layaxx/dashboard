import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetReadlistentriesInput
  extends Pick<Prisma.ReadlistentryFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetReadlistentriesInput) => {
    const {
      items: readlistentries,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.readlistentry.count({ where }),
      query: (paginateArguments) =>
        db.readlistentry.findMany({ ...paginateArguments, where, orderBy }),
    })

    return {
      readlistentries,
      nextPage,
      hasMore,
      count,
    }
  }
)
