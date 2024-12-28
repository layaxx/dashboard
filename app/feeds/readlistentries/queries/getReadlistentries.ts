import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

type GetReadlistentriesInput = Pick<
  Prisma.ReadlistentryFindManyArgs,
  "where" | "orderBy" | "skip" | "take"
>

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
        db.readlistentry.findMany({
          ...paginateArguments,
          where,
          orderBy: orderBy ?? { id: "desc" },
        }),
    })

    return {
      readlistentries,
      nextPage,
      hasMore,
      count,
    }
  },
)
