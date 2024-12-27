/* eslint-disable max-lines */
import { Ctx } from "@blitzjs/next"
import { invokeWithCtx } from "@blitzjs/rpc"
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
  context: Ctx,
): Promise<LoadFeedResult> => {
  if (!context) {
    throw new Error("Missing ctx info")
  }

  const minutesSinceLastLoad = dayjs().diff(dayjs(feed.lastLoad), "minutes")
  const exponentialFalloffFactor = 1.8
  const targetInterval =
    feed.loadIntervall * Math.pow(exponentialFalloffFactor, feed.consecutiveFailedLoads ?? 0)

  if (!forceReload && targetInterval > minutesSinceLastLoad) {
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
    return {
      status: LoadFeedStatus.ERROR,
      statusMessage: "Failed to fetch from url " + feed.url,
      errorMessage: formatErrorMessage(error),
    }
  }

  let items: Prisma.FeedentryUncheckedCreateInput[] = []
  if (content) {
    setReaderOptions({ includeFullContent: true, descriptionMaxLen: summaryLength })
    setParserOptions({ trimValues: false })

    let parsedFeed: FeedData | null
    try {
      parsedFeed = parseString(content)
      if (!parsedFeed) {
        throw new Error("Failed to parse feed")
      }
    } catch {
      console.error("Encountered an error while parsing " + feed.url, headers)
      return {
        status: LoadFeedStatus.ERROR,
        statusMessage: "Failed to parse " + feed.url,
      }
    }

    try {
      items = parsedFeed.entries?.map((item) => convertItem(item, feed)) ?? []
    } catch (error) {
      console.error("Encountered an error while processing items for " + feed.url)
      console.error(error)
      return {
        status: LoadFeedStatus.ERROR,
        statusMessage: "Failed to process items for url " + feed.url,
        errorMessage: formatErrorMessage(error),
      }
    }
  } else {
    console.warn("Received no content from " + feed.url, statusCode)
  }

  const { createdIds, updatedIds } = await updateDB(items, context)

  await db.feed.update({
    data: { lastLoad: dayjs().toISOString(), etag: headers.get("etag"), consecutiveFailedLoads: 0 },
    where: { id: feed.id },
  })

  return {
    changes: {
      updatedIds,
      createdIds,
      ignored: items.length - (createdIds.length + updatedIds.length),
    },
    status: LoadFeedStatus.UPDATED,
  }
}

export async function updateDB(
  items: Prisma.FeedentryUncheckedCreateInput[],
  context: Ctx,
): Promise<{
  createdIds: string[]
  updatedIds: string[]
}> {
  const alreadyExistingEntries = await db.feedentry.findMany({
    where: { id: { in: items.map((item) => item.id) } },
    select: { id: true, preXSSHash: true, isArchived: true },
  })

  const existingEntryIds = new Set(alreadyExistingEntries.map((entry) => entry.id))
  const existingNonArchivedEntryIds = new Set(
    alreadyExistingEntries.filter((entry) => !entry.isArchived).map((entry) => entry.id),
  )

  const itemsToBeCreated: Prisma.FeedentryUncheckedCreateInput[] = items.filter(
    (item) => !existingEntryIds.has(item.id),
  )

  const createdItems = await invokeWithCtx(
    createManyFeedEntries,
    {
      skipDuplicates: true,
      data: itemsToBeCreated,
    },
    context,
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
        !!value && !!value.id && !!value.text && !!value.updatedAt,
    )

  await Promise.all(
    itemsToBeUpdated.map(async (input) => {
      return invokeWithCtx(updateFeedentry, { input, select: { id: true } }, context)
    }),
  )

  return {
    createdIds: createdItems.map(({ id }) => id),
    updatedIds: itemsToBeUpdated.map(({ id }) => String(id)),
  }
}

export async function fetchFromURL(
  url: string,
  force: boolean,
  feed?: Feed,
): Promise<{ content: string | undefined; headers: Headers; statusCode: number; ok: boolean }> {
  const headersRequest = new Headers({
    Accept: "text/xml",
    "user-agent": "dashboard-rss-reader/1.1",
  })
  if (!force) {
    if (feed && feed.etag) {
      headersRequest.append("If-None-Match", feed.etag)
    } else if (feed) {
      headersRequest.append(
        "If-Modified-Since",
        dayjs(feed.lastLoad).utc().format("ddd, DD MM YYYY HH:mm:ss [GMT]"),
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
  url: string,
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

export async function getIDSFromFeeds(feedUrls: string[]): Promise<Map<string, Set<string>>> {
  const result = new Map()

  for (const url of feedUrls) {
    const response = await fetchFromURL(url, true).catch((error) => {
      console.error("Encountered an error while fetching " + url)
      console.error(error)
    })

    if (!response) {
      continue
    }

    const { content, headers, statusCode } = response

    if (content) {
      setReaderOptions({ includeFullContent: false, descriptionMaxLen: 0 })
      const parsedFeed = parseString(content)
      if (!parsedFeed) {
        console.error("Encountered an error while parsing " + url, headers)
        continue
      }
      result.set(
        url,
        new Set(parsedFeed.entries?.map((item) => item.guid || item.id || item.link) ?? []),
      )
    } else {
      console.warn("Received no content from " + url, statusCode)
    }
  }

  return result
}

/**
 * Adapted from: https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript
 *
 * @param error
 * @returns string containing the error message
 */
function formatErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  )
    return (error as { message: string }).message as string

  try {
    return new Error(JSON.stringify(error)).message
  } catch {
    // fallback in case there's an error stringifying the maybeError
    // like with circular references for example.
    return new Error(String(error)).message
  }
}
