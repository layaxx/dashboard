import { resolver } from "blitz"
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
    return await db.feed.create({
      data: { name, url, loadIntervall, number: -1, lastLoad: dayjs(0).toDate() },
    })
  }
)
