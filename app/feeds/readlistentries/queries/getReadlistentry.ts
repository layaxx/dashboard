import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import { z } from "zod"
import db from "db"

const GetReadlistentry = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
  isArchived: z.boolean(),
})

export default resolver.pipe(
  resolver.zod(GetReadlistentry),
  resolver.authorize(),
  async ({ id }) => {
    const readlistentry = await db.readlistentry.findFirst({ where: { id } })

    if (!readlistentry) throw new NotFoundError()

    return readlistentry
  }
)
