import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import { z } from "zod"
import { email, username } from "../validations"
import db from "db"

export default resolver.pipe(
  resolver.zod(z.object({ email, name: username })),
  resolver.authorize(),
  async ({ name, email }, context) => {
    const user = await db.user.findFirst({ where: { id: context.session.userId! } })
    if (!user) throw new NotFoundError()

    const newData = await db.user.update({
      data: { name, email },
      where: { id: user.id },
    })

    return newData
  }
)
