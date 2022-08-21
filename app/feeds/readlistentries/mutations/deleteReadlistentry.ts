import { resolver } from "@blitzjs/rpc"
import { z } from "zod"
import db from "db"

const DeleteReadlistentry = z.object({
  id: z.number(),
})

export default resolver.pipe(
  resolver.zod(DeleteReadlistentry),
  resolver.authorize(),
  async ({ id }) => {
    const readlistentry = await db.readlistentry.deleteMany({ where: { id } })

    return readlistentry
  }
)
