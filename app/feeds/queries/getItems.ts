import { resolver } from "blitz"
import { FeedAPIResponse } from "../components/FeedList"
import { reportError } from "../utils/reportErrors"

type InputParameters = {
  id?: number
  batchSize?: number
  getRead?: boolean
  oldestFirst?: boolean
}

export default resolver.pipe(
  resolver.authorize(),
  async ({ id = -1, batchSize = 20, getRead = false, oldestFirst = true }: InputParameters) => {
    const url = new URL((process.env["NEWS_BASE_URL"] || "") + "/items")

    const parameter: { [key: string]: number | string | boolean } = {
      getRead, // if true it returns all items, false returns only unread items
      id, // the id of the folder or feed, Use 0 for Starred and All
      oldestFirst, // implemented in 3.002, if true it reverse the sort order
      type: 0, // the type of the query (Feed: 0, Folder: 1, Starred: 2, All: 3)
      batchSize,
    }

    Object.keys(parameter)
      .filter((key) => key !== "type" || id !== -1)
      .map((key) => url.searchParams.append(key, "" + parameter[key]))

    const items =
      fetch(url.toString(), {
        headers: {
          Accept: "application/json",
          Authorization: `Basic ${process.env["NEWS_CREDENTIALS"]}`,
        },
      })
        .then((response) => response.json())
        .then((json) => json.items)
        .catch((...data) => reportError("readItems", url, undefined, data)) || []

    const count = fetch(process.env["NEWS_BASE_URL"] + "/feeds", {
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${process.env["NEWS_CREDENTIALS"]}`,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        return id !== -1
          ? json.feeds.find(({ id: idC }: FeedAPIResponse) => idC === id).unreadCount
          : json.feeds
              .map((feed: FeedAPIResponse) => feed.unreadCount)
              .reduce((a: number, b: number) => a + b, 0)
      })
      .catch((...data) =>
        reportError("countItems", process.env["NEWS_BASE_URL"] + "/feeds", undefined, data)
      )

    return {
      items: (await items) ?? [],
      hasMore: (await count) > batchSize,
      nextPage: { batchSize },
    }
  }
)
