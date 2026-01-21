import { resolver } from "@blitzjs/rpc"
import dayjs from "dayjs"
import { z } from "zod"
import createFeed from "./createFeed"
import createFeedEntry from "./createFeedEntry"
import deleteAllFeedEntries from "./deleteAllFeedEntries"
import deleteAllFeeds from "./deleteAllFeeds"
import type { Feed, Feedentry } from "db"

const Options = z.object({
  fileContent: z.string().min(2),
  shouldDeleteBefore: z.boolean().optional().default(false),
})

export default resolver.pipe(
  resolver.zod(Options),
  resolver.authorize(),
  async ({ fileContent, shouldDeleteBefore }, context) => {
    let parsedContent
    try {
      parsedContent = JSON.parse(fileContent)
    } catch {
      throw new Error("Failed to parse JSON.")
    }

    if (!parsedContent.feeds || !Array.isArray(parsedContent.feeds)) {
      throw new Error("No Array of feeds provided.")
    }
    if (!parsedContent.feedEntries || !Array.isArray(parsedContent.feedEntries)) {
      throw new Error("No Array of feedEntries provided.")
    }

    if (shouldDeleteBefore) {
      await Promise.all([
        deleteAllFeedEntries({ confirm: true }, context),
        deleteAllFeeds({ confirm: true }, context),
      ])
    }

    const idLookup = new Map()
    const feeds = await Promise.all(
      parsedContent.feeds.map(async (feed: Feed) => {
        const result = await createFeed(
          {
            name: feed.name,
            url: feed.url,
            loadIntervall: feed.loadIntervall,
          },
          context
        )
        idLookup.set(feed.id, result.id)
        return result
      })
    )

    const feedEntries = await Promise.all(
      parsedContent.feedEntries.map(
        async ({
          createdAt,
          feedId,
          id,
          isArchived,
          link,
          summary,
          text,
          title,
          updatedAt,
        }: Feedentry) => {
          const result = await createFeedEntry(
            {
              createdAt: dayjs(createdAt).toISOString(),
              feedId: idLookup.get(feedId),
              id,
              isArchived,
              link,
              summary,
              text,
              title,
              updatedAt: dayjs(updatedAt).toISOString(),
            },
            context
          )

          return result
        }
      )
    )

    return { feeds, feedEntries }
  }
)
