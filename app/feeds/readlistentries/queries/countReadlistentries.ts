import { resolver } from "@blitzjs/rpc"
import db from "db"

export default resolver.pipe(resolver.authorize(), async () => {
  return await db.readlistentry.count({ where: { isArchived: { equals: false } } })
})
