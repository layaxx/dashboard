import { resolver } from "blitz"
import { reportError } from "../utils/reportErrors"
import { Prisma } from "db"

interface GetFeedsInput
  extends Pick<Prisma.FeedFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(resolver.authorize(), async ({}: GetFeedsInput) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant

  /*     const {
      items: feeds,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.feed.count({ where }),
      query: (paginateArgs) => db.feed.findMany({ ...paginateArgs, where, orderBy }),
    })
 */
  return {
    feeds: await fetch(process.env["NEWS_BASE_URL"] + "/feeds", {
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${process.env["NEWS_CREDENTIALS"]}`,
      },
    })
      .then((res) => res.json())
      .then((json) => json.feeds)
      .catch((...data) =>
        reportError("readItems", process.env["NEWS_BASE_URL"] + "/feeds", undefined, data)
      ),
    nextPage: false,
    hasMore: false,
    count: 0,
  }
})
