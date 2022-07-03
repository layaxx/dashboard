import { resolver } from "blitz"
import { z } from "zod"
import db from "db"

const CreateFeedEntry = z.object({
  id: z.string(),
  link: z.string(),
  summary: z.string(),
  text: z.string(),
  title: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  feedId: z.number(),
  isArchived: z.boolean(),
})

export default resolver.pipe(
  resolver.zod(CreateFeedEntry),
  resolver.authorize(),
  async ({ id, link, summary, text, title, createdAt, feedId, isArchived, updatedAt }) => {
    return await db.feedentry.create({
      data: { id, link, summary, text, title, createdAt, feedId, isArchived, updatedAt },
    })
  }
)
