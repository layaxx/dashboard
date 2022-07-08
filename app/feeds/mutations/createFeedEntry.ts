import { resolver } from "blitz"
import dayjs from "dayjs"
import { z } from "zod"
import db from "db"

const CreateFeedEntry = z.object({
  id: z.string(),
  link: z.string(),
  title: z.string(),
  text: z.string(),
  summary: z.string(),
  feedId: z.number(),
  createdAt: z.string().optional().default(dayjs().toISOString()),
  updatedAt: z.string().optional().default(dayjs().toISOString()),
  isArchived: z.boolean().optional().default(false),
})

export default resolver.pipe(
  resolver.zod(CreateFeedEntry),
  resolver.authorize(),
  async ({ id, link, summary, text, title, createdAt, feedId, isArchived, updatedAt }) => {
    return await db.feedentry.create({
      data: {
        id,
        link,
        summary,
        text,
        title,
        feedId,
        isArchived,
        updatedAt,
        createdAt,
      },
    })
  }
)
