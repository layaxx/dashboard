import { resolver } from "blitz"
import { reportError } from "../utils/reportErrors"

export default resolver.pipe(resolver.authorize(), async () => {
  return {
    feeds:
      (await fetch(process.env["NEWS_BASE_URL"] + "/feeds", {
        headers: {
          Accept: "application/json",
          Authorization: `Basic ${process.env["NEWS_CREDENTIALS"]}`,
        },
      })
        .then((response) => response.json())
        .then((json) => json.feeds)
        .catch((...data) =>
          reportError("readItems", process.env["NEWS_BASE_URL"] + "/feeds", undefined, data)
        )) || [],
  }
})
