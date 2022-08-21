import { resolver } from "@blitzjs/rpc"
import { z } from "zod"
import db from "db"

const UpdateReadlistentry = z.object({
  id: z.number(),
  isArchived: z.boolean(),
})

export default resolver.pipe(
  resolver.zod(UpdateReadlistentry),
  resolver.authorize(),
  async ({ id, ...data }) => {
    const readlistentry = await db.readlistentry.update({ where: { id }, data })

    return readlistentry
  }
)
