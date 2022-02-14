import { resolver } from "blitz"
import { z } from "zod"
import { reportError } from "../utils/reportErrors"

const Options = z.object({
  id: z.number(),
  read: z.boolean(),
})

export default resolver.pipe(resolver.zod(Options), resolver.authorize(), async ({ read, id }) => {
  const url = `${process.env["NEWS_BASE_URL"]}/items/${id}/${read ? "read" : "unread"}`
  return await fetch(url, {
    headers: { Authorization: `Basic ${process.env["NEWS_CREDENTIALS"]}` },
    method: "PUT",
  }).catch((...data) => reportError("readItems", url, undefined, data))
})
