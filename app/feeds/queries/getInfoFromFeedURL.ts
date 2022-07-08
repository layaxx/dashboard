import { resolver } from "blitz"
import { z } from "zod"
import { getTitleAndTTLFromFeed } from "lib/serverOnly/loadRSSHelpers"

const GetFeed = z.object({
  url: z.string(),
})

export default resolver.pipe(resolver.zod(GetFeed), resolver.authorize(), async ({ url }) => {
  return getTitleAndTTLFromFeed(url)
})
