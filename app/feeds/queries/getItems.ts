import { resolver } from "blitz"
import { reportError } from "../utils/reportErrors"

export default resolver.pipe(resolver.authorize(), async ({ id }: { id: number }) => {
  const url = new URL((process.env["NEWS_BASE_URL"] || "") + "/items")

  const parameter: { [key: string]: number | string | boolean } = {
    getRead: false, // if true it returns all items, false returns only unread items
    id, // the id of the folder or feed, Use 0 for Starred and All
    oldestFirst: true, // implemented in 3.002, if true it reverse the sort order
    type: 0, // the type of the query (Feed: 0, Folder: 1, Starred: 2, All: 3)
  }

  Object.keys(parameter)
    .filter((key) => key !== "type" || id !== -1)
    .map((key) => url.searchParams.append(key, "" + parameter[key]))

  console.log(url.toString())

  return {
    items: await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${process.env["NEWS_CREDENTIALS"]}`,
      },
    })
      .then((response) => response.json())
      .then((json) => json.items)
      .catch((...data) => reportError("readItems", url, undefined, data)),
  }
})
