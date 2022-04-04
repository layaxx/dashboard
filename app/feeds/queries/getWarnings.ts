import { resolver } from "blitz"
import { reportError } from "../utils/reportErrors"

export default resolver.pipe(resolver.authorize(), async () => {
  const url = new URL((process.env["NEWS_BASE_URL"] || "") + "/status")

  const warnings =
    fetch(url.toString(), {
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${process.env["NEWS_CREDENTIALS"]}`,
      },
    })
      .then((response) => response.json())
      .then((json) => json.warnings)
      .catch((...data) => reportError("getWarnings", url, undefined, data)) || []

  return {
    warnings: (await warnings) ?? [],
  }
})
