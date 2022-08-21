import { resolver } from "@blitzjs/rpc"
import dayjs from "dayjs"
import { z } from "zod"
import db from "db"

const CreateFeed = z.object({
  skipDuplicates: z.boolean().optional().default(false),
  data: z.array(
    z.object({
      name: z.string(),
      url: z.string(),
      loadIntervall: z.number(),
    })
  ),
})

export default resolver.pipe(
  resolver.zod(CreateFeed),
  resolver.authorize(),
  async ({ data, skipDuplicates }) => {
    const maxPositionResult = await db.feed.aggregate({ _max: { position: true } })
    const firstPosition = (maxPositionResult._max.position ?? -1) + 1
    return await db.feed.createMany({
      data: data.map(({ name, url, loadIntervall }, index) => ({
        name,
        url,
        loadIntervall,
        position: firstPosition + index,
        lastLoad: dayjs(0).toDate(),
      })),
      skipDuplicates,
    })
  }
)
