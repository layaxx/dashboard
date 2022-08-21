import { resolver } from "@blitzjs/rpc"
import { z } from "zod"
import db from "db"

const Options = z.object({
  id: z.string(),
  read: z.boolean(),
})

export default resolver.pipe(
  resolver.zod(Options),
  resolver.authorize(),
  async ({ read, id }) => await db.feedentry.update({ where: { id }, data: { isArchived: read } })
)
