import { resolver } from "@blitzjs/rpc"
import { z } from "zod"
import db from "db"

const CreateReadlistentry = z.object({
  url: z.string(),
})

export default resolver.pipe(
  resolver.zod(CreateReadlistentry),
  resolver.authorize(),
  async (input) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const readlistentry = await db.readlistentry.create({ data: input })

    return readlistentry
  }
)
