import { resolver } from "blitz"
import { z } from "zod"

const UpdateFeedentry = z.object({
  id: z.string(),
  name: z.string(),
})

export default resolver.pipe(resolver.zod(UpdateFeedentry), resolver.authorize(), async () => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  //const feedentry = await db.feedentry.update({ where: { id }, data })

  //return feedentry

  throw new Error("Not yet Implemented")
})
