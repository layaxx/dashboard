import { resolver } from "blitz"
import { z } from "zod"
import { reportError } from "../utils/reportErrors"

const Options = z.object({
  read: z.boolean(),
  id: z.number(),
})

export default resolver.pipe(resolver.zod(Options), resolver.authorize(), async ({ read, id }) => {
  const url = `${process.env["NEWS_BASE_URL"]}/items/${id}/${read ? "read" : "unread"}`
  return (
    await fetch(url, {
      method: "PUT",
      headers: { Authorization: `Basic ${process.env["NEWS_CREDENTIALS"]}` },
    }).catch((...data) => reportError("readItems", url, undefined, data))
  ).ok
})
