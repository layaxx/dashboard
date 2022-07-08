import { resolver } from "blitz"
import dayjs from "dayjs"
import { z } from "zod"
import db from "db"

const UpdateFeedEntry = z.object({
  select: z.any().optional(),
  input: z.object({
    id: z.string(),
    link: z.string().optional(),
    title: z.string().optional(),
    text: z.string().optional(),
    summary: z.string().optional(),
    feedId: z.number().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional().default(dayjs().toISOString()),
    isArchived: z.boolean().optional(),
  }),
})

export default resolver.pipe(
  resolver.zod(UpdateFeedEntry),
  resolver.authorize(),
  async ({
    input: { id, link, summary, text, title, createdAt, feedId, isArchived, updatedAt },
    select,
  }) => {
    return await db.feedentry.update({
      data: {
        link,
        summary,
        text,
        title,
        feedId,
        isArchived,
        updatedAt,
        createdAt,
      },
      where: { id },
      select,
    })
  }
)
