import { resolver } from "blitz"

export default resolver.pipe(
  resolver.authorize(),
  async ({ id, lastModified }: { id: number; lastModified: number }) => {
    const url = new URL((process.env["NEWS_BASE_URL"] || "") + "/items/updated")

    const params: { [key: string]: number | string | boolean } = {
      type: 0, // the type of the query (Feed: 0, Folder: 1, Starred: 2, All: 3)
      id, // the id of the folder or feed, Use 0 for Starred and All
      getRead: false, // if true it returns all items, false returns only unread items
      oldestFirst: true, // implemented in 3.002, if true it reverse the sort order
      lastModified,
    }

    Object.keys(params)
      .filter((key) => key !== "type" || id !== -1)
      .map((key) => url.searchParams.append(key, "" + params[key]))

    return {
      items: await fetch(url.toString(), {
        headers: {
          Accept: "application/json",
          Authorization: `Basic ${process.env["NEWS_CREDENTIALS"]}`,
        },
      })
        .then((res) => res.json())
        .then((json) => json.items),
    }
  }
)
