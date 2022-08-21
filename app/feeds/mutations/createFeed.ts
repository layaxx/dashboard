import { resolver } from "@blitzjs/rpc"
import dayjs from "dayjs"
import { z } from "zod"
import db from "db"

const CreateFeed = z.object({
  name: z.string(),
  url: z.string(),
  loadIntervall: z.number(),
})

export default resolver.pipe(
  resolver.zod(CreateFeed),
  resolver.authorize(),
  async ({ name, url, loadIntervall }) => {
    const maxPositionResult = await db.feed.aggregate({ _max: { position: true } })
    const position = (maxPositionResult._max.position ?? -1) + 1
    return await db.feed.create({
      data: { name, url, loadIntervall, position, lastLoad: dayjs(0).toDate() },
    })
  }
)
