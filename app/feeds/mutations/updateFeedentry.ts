import { resolver } from "blitz"
import dayjs from "dayjs"
import { z } from "zod"
import { createHash } from "crypto"
import db from "db"
import { cleanXSS } from "lib/feeds/feedHelpers"

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
    preXSSHash: z.string().optional(),
  }),
})

export default resolver.pipe(
  resolver.zod(UpdateFeedEntry),
  resolver.authorize(),
  async ({
    input: { id, link, summary, text, title, createdAt, feedId, isArchived, updatedAt, preXSSHash },
    select,
  }) => {
    if (!preXSSHash && (!summary || !text)) {
      throw new Error(
        "When updating Feedentry without preXSS Hash, new summary and text must be provided"
      )
    }
    if (!!summary) {
      summary = cleanXSS(summary)
    }
    if (!!text) {
      text = cleanXSS(text)
    }
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
        preXSSHash:
          preXSSHash ??
          createHash("sha1")
            .update(text! + summary!)
            .digest("hex"),
      },
      where: { id },
      select,
    })
  }
)
