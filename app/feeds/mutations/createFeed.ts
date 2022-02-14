import { resolver } from "blitz"
import { z } from "zod"

const CreateFeed = z.object({
  url: z.string(),
})

export default resolver.pipe(resolver.zod(CreateFeed), resolver.authorize(), async (input) => {
  const body = {
    // eslint-disable-next-line unicorn/no-null
    folderId: null,
    url: input.url,
  }

  const url = `${process.env["NEWS_BASE_URL"]}/feeds`
  return await fetch(url, {
    headers: {
      Authorization: `Basic ${process.env["NEWS_CREDENTIALS"]}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(body),
  })
})
