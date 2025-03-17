import { resolver } from "@blitzjs/rpc"
import dayjs from "dayjs"
import { z } from "zod"
import { createHash } from "crypto"
import db from "db"
import { cleanXSS } from "lib/feeds/feedHelpers"

const CreateFeedEntry = z.object({
  skipDuplicates: z.boolean().optional().default(false),
  data: z.array(
    z.object({
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
  ),
})

export default resolver.pipe(
  resolver.zod(CreateFeedEntry),
  resolver.authorize(),
  async ({ data, skipDuplicates }) => {
    return await db.feedentry.createManyAndReturn({
      data: data.map(
        ({ id, link, summary, text, title, createdAt, feedId, isArchived, updatedAt }) => ({
          id,
          link,
          summary: cleanXSS(summary),
          text: cleanXSS(text),
          title: cleanXSS(title),
          feedId,
          isArchived,
          updatedAt,
          createdAt,
          preXSSHash: createHash("sha1")
            .update(text + summary)
            .digest("hex"),
        })
      ),
      skipDuplicates,
    })
  }
)
