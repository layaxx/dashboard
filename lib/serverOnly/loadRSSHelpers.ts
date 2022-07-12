import { invokeWithMiddleware, NextApiRequest } from "blitz"
import { Prisma } from "@prisma/client"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import Parser from "rss-to-js"
import { createHash } from "crypto"
import { LoadFeedResult, LoadFeedStatus } from "../feeds/types"
import { ResponseWithSession } from "app/api/loadRSS"
import createManyFeedEntries from "app/feeds/mutations/createManyFeedEntries"
import updateFeedentry from "app/feeds/mutations/updateFeedentry"
import db, { Feed } from "db"
import { convertItem } from "lib/feeds/feedHelpers"

dayjs.extend(utc)

export const loadFeed = async (
  feed: Feed,
  forceReload: boolean,
  { req, res }: { req: NextApiRequest; res: ResponseWithSession }
): Promise<LoadFeedResult> => {
  if (!req || !res) {
    throw new Error("Missing ctx info")
  }

  const minutesSinceLastLoad = dayjs().diff(dayjs(feed.lastLoad), "minutes")
  console.log("Minutes since last load", minutesSinceLastLoad)
  if (!forceReload && feed.loadIntervall > minutesSinceLastLoad) {
    console.log("Skipping due to loadIntervall", feed.name)
    return { status: LoadFeedStatus.SKIPPED, statusMessage: "Skipped due to feed.loadIntervall." }
  }

  let content, headers, statusCode, ok
  try {
    ;({ content, headers, statusCode, ok } = await fetchFromURL(feed.url, forceReload, feed))
    const HTTP_NOT_MODIFIED = 304
    if (statusCode === HTTP_NOT_MODIFIED) {
      return { status: LoadFeedStatus.SKIPPED, statusMessage: "Skipped due to Server Response." }
    }
    if (!ok) {
      throw new Error("Response was not ok")
    }
  } catch {
    console.error("Encountered an error while fetching " + feed.url)
    return { status: LoadFeedStatus.ERROR, statusMessage: "Failed to fetch from url " + feed.url }
  }

  let items: Prisma.FeedentryUncheckedCreateInput[] = []
  if (!content) {
    console.warn("Received no content from " + feed.url, statusCode)
  } else {
    let parsedFeed
    try {
      parsedFeed = await new Parser().parseString(content)
    } catch {
      console.error("Encountered an error while parsing " + feed.url, headers)
      return { status: LoadFeedStatus.ERROR, statusMessage: "Failed to parse " + feed.url }
    }

    try {
      items = parsedFeed.items?.map((item) => convertItem(item, feed)) ?? []
    } catch {
      console.error("Encountered an error while processing items for " + feed.url)
      return {
        status: LoadFeedStatus.ERROR,
        statusMessage: "Failed to process items for url " + feed.url,
      }
    }
  }

  const alreadyExistingEntries = await db.feedentry.findMany({
    where: { id: { in: items.map((item) => item.id) } },
    select: { id: true, preXSSHash: true },
  })

  const existingEntryIds = new Set(alreadyExistingEntries.map((entry) => entry.id))

  const itemsToBeCreated: Prisma.FeedentryUncheckedCreateInput[] = items.filter(
    (item) => !existingEntryIds.has(item.id)
  )

  const { count: countCreated } = await invokeWithMiddleware(
    createManyFeedEntries,
    {
      skipDuplicates: true,
      data: itemsToBeCreated,
    },
    { req, res }
  )

  const itemsToBeUpdated = items
    .filter((item) => existingEntryIds.has(item.id))
    .map((item): Prisma.FeedentryUncheckedUpdateInput | undefined => {
      const oldItem = alreadyExistingEntries.find((oldItem) => item.id === oldItem.id)
      if (oldItem && item.text) {
        const preXSSHash = createHash("sha1")
          .update(item.text + item.summary)
          .digest("hex")

        if (oldItem.preXSSHash !== item.preXSSHash) {
          return {
            id: oldItem.id,
            text: item.text,
            summary: item.summary,
            isArchived: false,
            preXSSHash,
            updatedAt: dayjs().toISOString(),
          }
        }
      }
    })
    .filter(
      (value): value is Prisma.FeedentryUncheckedUpdateInput =>
        !!value && !!value.id && !!value.text && !!value.updatedAt
    )

  const updatedFeedEntries = await Promise.all(
    itemsToBeUpdated.map(async (input) => {
      return await invokeWithMiddleware(
        updateFeedentry,
        { input, select: { id: true } },
        { req, res }
      )
    })
  )

  await db.feed.update({
    data: { lastLoad: dayjs().toISOString(), etag: headers.get("etag") },
    where: { id: feed.id },
  })

  const countUpdated = updatedFeedEntries.length

  return {
    changes: {
      updated: countUpdated,
      ignored: items.length - (countCreated + countUpdated),
      created: countCreated,
    },
    status: LoadFeedStatus.UPDATED,
  }
}

async function fetchFromURL(
  url: string,
  force: boolean,
  feed?: Feed
): Promise<{ content: string | undefined; headers: Headers; statusCode: number; ok: boolean }> {
  const headersRequest = new Headers({
    Accept: "text/xml",
    "user-agent": "dashboard-rss-reader/1.0",
  })
  if (!force) {
    if (feed && feed.etag) {
      headersRequest.append("If-None-Match", feed.etag)
    } else if (feed) {
      headersRequest.append(
        "If-Modified-Since",
        dayjs(feed.lastLoad).utc().format("ddd, DD MM YYYY HH:mm:ss [GMT]")
      )
    }
  }

  const response = await fetch(url, {
    headers: headersRequest,
  })
  const content = await response.text()
  const { headers, status: statusCode, ok } = response
  return { content, headers, statusCode, ok }
}

export async function getTitleAndTTLFromFeed(
  url: string
): Promise<[string | undefined, string | undefined]> {
  let content: string | undefined, ok: boolean, headers: Headers
  try {
    ;({ content, ok, headers } = await fetchFromURL(url, true))
    if (!content || !ok) {
      throw new Error("Failed to get content from " + url)
    }
  } catch (error) {
    console.error(error)
    throw new Error("Failed to fetch feed.")
  }

  let parsedFeed
  try {
    parsedFeed = await new Parser().parseString(content)
  } catch (error) {
    console.error(error)
    throw new Error("Failed to parse feed.")
  }

  return [parsedFeed.title, parsedFeed.ttl ?? headers.get("expires") ?? undefined]
}
