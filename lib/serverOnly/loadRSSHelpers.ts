import { invokeWithCtx, AuthenticatedMiddlewareCtx } from "@blitzjs/rpc"
import { Prisma } from "@prisma/client"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import { parseString, setReaderOptions, setParserOptions, FeedData } from "feed-reader"
import fetch, { Headers } from "node-fetch"
import { createHash } from "crypto"
import { LoadFeedResult, LoadFeedStatus } from "../feeds/types"
import createManyFeedEntries from "app/feeds/mutations/createManyFeedEntries"
import updateFeedentry from "app/feeds/mutations/updateFeedentry"
import db, { Feed } from "db"
import summaryLength from "lib/config/feeds/summaryLength"
import { convertItem } from "lib/feeds/feedHelpers"

dayjs.extend(utc)

export const loadFeed = async (
  feed: Feed,
  forceReload: boolean,
  context: AuthenticatedMiddlewareCtx
): Promise<LoadFeedResult> => {
  if (!context) {
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
  } catch (error) {
    console.error("Encountered an error while fetching " + feed.url)
    console.error(error)
    return { status: LoadFeedStatus.ERROR, statusMessage: "Failed to fetch from url " + feed.url }
  }

  let items: Prisma.FeedentryUncheckedCreateInput[] = []
  if (!content) {
    console.warn("Received no content from " + feed.url, statusCode)
  } else {
    setReaderOptions({ includeFullContent: true, descriptionMaxLen: summaryLength })
    const parsedFeed = parseString(content)
    if (!parsedFeed) {
      console.error("Encountered an error while parsing " + feed.url, headers)
      return { status: LoadFeedStatus.ERROR, statusMessage: "Failed to parse " + feed.url }
    }
    try {
      items = parsedFeed.entries?.map((item) => convertItem(item, feed)) ?? []
    } catch (error) {
      console.error("Encountered an error while processing items for " + feed.url)
      console.error(error)
      return {
        status: LoadFeedStatus.ERROR,
        statusMessage: "Failed to process items for url " + feed.url,
      }
    }
  }

  const { countUpdated, countCreated } = await updateDB(items, context)

  await db.feed.update({
    data: { lastLoad: dayjs().toISOString(), etag: headers.get("etag") },
    where: { id: feed.id },
  })

  return {
    changes: {
      updated: countUpdated,
      ignored: items.length - (countCreated + countUpdated),
      created: countCreated,
    },
    status: LoadFeedStatus.UPDATED,
  }
}

export async function updateDB(
  items: Prisma.FeedentryUncheckedCreateInput[],
  context: AuthenticatedMiddlewareCtx
): Promise<{
  countUpdated: number
  countCreated: number
}> {
  const alreadyExistingEntries = await db.feedentry.findMany({
    where: { id: { in: items.map((item) => item.id) } },
    select: { id: true, preXSSHash: true, isArchived: true },
  })

  const existingEntryIds = new Set(alreadyExistingEntries.map((entry) => entry.id))
  const existingNonArchivedEntryIds = new Set(
    alreadyExistingEntries.filter((entry) => !entry.isArchived).map((entry) => entry.id)
  )

  const itemsToBeCreated: Prisma.FeedentryUncheckedCreateInput[] = items.filter(
    (item) => !existingEntryIds.has(item.id)
  )

  const { count: countCreated } = await invokeWithCtx(
    createManyFeedEntries,
    {
      skipDuplicates: true,
      data: itemsToBeCreated,
    },
    context
  )

  const itemsToBeUpdated = items
    .filter((item) => existingNonArchivedEntryIds.has(item.id))
    .map((item): Prisma.FeedentryUncheckedUpdateInput | undefined => {
      const oldItem = alreadyExistingEntries.find((oldItem) => item.id === oldItem.id)
      if (oldItem && item.text) {
        const preXSSHash = createHash("sha1")
          .update(item.text + item.summary)
          .digest("hex")

        if (oldItem.preXSSHash !== preXSSHash) {
          return {
            id: oldItem.id,
            text: item.text,
            summary: item.summary,
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
      return await invokeWithCtx(updateFeedentry, { input, select: { id: true } }, context)
    })
  )

  return { countCreated, countUpdated: updatedFeedEntries.length }
}

export async function fetchFromURL(
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
): Promise<[string | undefined, number | undefined]> {
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

  let parsedFeed: FeedData | undefined | null
  try {
    setReaderOptions({ includeFullContent: true })
    setParserOptions({ stopNodes: ["*.item", "*.entry"] })
    parsedFeed = parseString(content)
    console.log(parsedFeed)
    setParserOptions({ stopNodes: undefined })
    if (!parsedFeed) {
      throw new Error("Failed to parse feed.")
    }
  } catch (error) {
    console.error(error)
    throw new Error("Failed to parse feed.")
  }

  let ttl: number | undefined

  if (parsedFeed.ttl) {
    ttl = +parsedFeed.ttl
  } else if (headers && headers.get("expires")) {
    ttl = Math.abs(dayjs(headers.get("expires")).diff(dayjs(), "minutes"))
  }

  return [parsedFeed.title, ttl]
}
