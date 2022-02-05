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
    count: 0,
    feeds: await fetch(process.env["NEWS_BASE_URL"] + "/feeds", {
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${process.env["NEWS_CREDENTIALS"]}`,
      },
    })
      .then((response) => response.json())
      .then((json) => json.feeds)
      .catch((...data) =>
        reportError("readItems", process.env["NEWS_BASE_URL"] + "/feeds", undefined, data)
      ),
    hasMore: false,
    nextPage: false,
  }
})
